import { CREATE_TRAVEL_MUTATION } from '@/graphql/travels/travel.mutations';
import { GET_ALL_ACTIVITIES } from '@/graphql/activity/activity.mutations';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { useForm, zodResolver } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Container, Stack, Text, Modal, Group, MultiSelect, List, ActionIcon, Flex, Box } from '@mantine/core';
import { Calendar, DatePicker } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import useAuthStore from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';
import { string, z } from 'zod';

const TravelCreateForm = () => {

  //Mutations and Querys
  const [createTravel] = useMutation(CREATE_TRAVEL_MUTATION);
  const { data, loading, error } = useQuery(GET_ALL_ACTIVITIES);

  //We obtain the current user
  const currentUser = useAuthStore((state) => state.currentUser);

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedFinishDate, setSelectedFinishDate] = useState<Date | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  //Items isnt done yet 2/11 FS
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [item, setItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const activities = data?.activities || [];

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      maxCap: 1,
      location: { longLatPoint: '' },
    },
    validate: zodResolver(travelValuesSchema),
  });

  //Add an item to the list (called by handleKeyDown)
  const handleAddItem = () => {
    if (item.trim() === '') {
      return;
    }
    //Validation to see if the item is already in the list, then dont add it
    if (items.includes(item)) {
      showNotification({
        message: 'Item already exists in the checklist!',
        color: 'red',
      });
      return;
    }
  
    setItems((prevItems) => [...prevItems, item]);
    setItem('');
  };

  //Event to add an item when the user presses Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddItem();
    }
  };

  //Principal function to send the travel to the data base
  const handleCreateTravelSubmit = async () => {

    console.log("Entro");
    //We obtain the values from the form const that we defined earlier
    const values = form.values;

    //Used to store the information of locations 2/11 FS we wont use it yet, but for the future
    const locationData = {
      name: "Solymar",
      state: "Canelones",
      address: "StewartVargasd",
      longLatPoint: '',
    };

    //We put all together in a constant for better use
    const travelData = {
      travelTitle: values.title,
      travelDescription: values.description,
      startDate: selectedStartDate?.toISOString(),
      finishDate: selectedFinishDate?.toISOString(),
      maxCap: values.maxCap,
      isEndable: false,
    };

    try {

      //Added because we will call currentUser (it cannot be null)
      if (!currentUser?.accessToken?.value) {
        console.error("No user logged in");
        return;
      }

      //We call the mutation to create the travel
      await createTravel({
        variables: {
          createTravelInput: travelData,
          activityId: selectedActivities.length > 0 ? selectedActivities : [],
          items: items.length > 0 ? items : [],
          userId: currentUser.id,
          createLocationInput: {
            name: "Solymar",
            state: "Canelones",
            address: "StewartVargasd",
            longLatPoint: values.location.longLatPoint,
          },
        },
      });

      showNotification({ message: 'Travel created sucesfully', color: 'green' });
      form.reset();

      setSelectedStartDate(null);
      setSelectedFinishDate(null);
      setSelectedActivities([]);

    } catch (error) {
      if (error instanceof ApolloError) {
        error.graphQLErrors.forEach(({ message }) => {
          console.error(message);
        });
      }
      showNotification({ message: 'Error creating the travel', color: 'red' });
      console.error("Error de", error);
    }
  };

  return (
    <Container mt="xl" style={{ textAlign: 'left', width: '100%' }}>
      <form onSubmit={form.onSubmit(handleCreateTravelSubmit)}>
        <Stack style={{ width: '100%' }}>

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Title  </Text>
          <TextInput {...form.getInputProps('title')} required />

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Description</Text>
          <Textarea {...form.getInputProps('description')} required />

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Max Capacity</Text>
          <NumberInput {...form.getInputProps('maxCap')} min={1} required style={{ maxWidth: 80 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            <div style={{ flex: 1, marginRight: '10px' }}>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Start Date</Text>
              <DatePicker
                value={selectedStartDate}
                onChange={setSelectedStartDate}
              />
            </div>

            <div style={{ flex: 1, marginLeft: '10px' }}>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>End Date</Text>
              <DatePicker
                value={selectedFinishDate}
                onChange={setSelectedFinishDate}
              />
            </div>
          </div>

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Activities</Text>
          <MultiSelect
            data={activities.map((
              activity: { id: any; activityName: any; }) => ({
                value: activity.id,
                label: activity.activityName
              }))}
            placeholder="Select activites for your travel"
            onChange={setSelectedActivities}
            style={{ fontWeight: 700, fontSize: '1.5rem', width: '30%' }}
          />

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>CheckList</Text>
          <TextInput
            style={{ fontWeight: 700, fontSize: '1.5rem', width: '30%' }}
            value={item}
            onChange={(e) => setItem(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add an item to your checklist!"
          />

          <MultiSelect
            data={items.map((i) => ({ value: i, label: i }))}
            value={items}
            onChange={setItems}
            placeholder="Selected Items"
            clearable
            searchable
          />

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Coords(longLatPoint)</Text>
          <TextInput {...form.getInputProps('location.longLatPoint')} required />

          <Button type="submit" mt="md" style={{ maxWidth: 140 }}>Create Travel</Button>
        </Stack>
      </form>
    </Container>
  );
};

export default TravelCreateForm;

const travelValuesSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  maxCap: z.number().min(1, 'Max Capacity must be more than 1'),
  items: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  location: z.object({
    longLatPoint: z.string().min(1, 'Coordinates are required'),
  }),
});

interface travelValues {
  title: string;
  description: string;
  maxCap: number;
  location: {
    longLatPoint: string;
  };
  startDate: Date | null;
  finishDate: Date | null;
  items: string[];
  activities: string[];
}