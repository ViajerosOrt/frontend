import { useCreateTravelMutation, useGetAllActivitiesQuery } from "@/graphql/__generated__/gql";
import { useForm, zodResolver } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Container, Stack, Text, Modal, Group, MultiSelect, List, ActionIcon, Flex, Box, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { notifications, showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { z } from 'zod';
import { useAuth } from "@/hooks/useAth";
import Router from "next/router";
import { VIAJERO_GREEN } from "@/consts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FaCheck } from "react-icons/fa";

const TravelCreateForm = () => {

  //Mutations and Querys
  const [createTravel] = useCreateTravelMutation({
    refetchQueries: ["travels"]
  });

  const { data } = useGetAllActivitiesQuery();

  //We obtain the current user
  const { currentUser } = useAuth()

  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  //Items isnt done yet 2/11 FS
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
      notifications.show({
        title: 'Warning!',
        message: `You cant add the same item twice`,
        color: 'yellow',
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

    //We obtain the values from the form const that we defined earlier
    const values = form.values;

    //We put all together in a constant for better use
    const travelData = {
      travelTitle: values.title,
      travelDescription: values.description,
      startDate: selectedDates[0]?.toISOString(),
      finishDate: selectedDates[1]?.toISOString(),
      maxCap: values.maxCap,
      isEndable: false,
    };

    try {

      //We call the mutation to create the travel
      await createTravel({
        variables: {
          createTravelInput: travelData,
          activityId: selectedActivities.length > 0 ? selectedActivities : [],
          items: items.length > 0 ? items : [],
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

      setSelectedDates([null, null]);
      setSelectedActivities([]);

    } catch (error) {
      showNotification({ message: 'Error creating the travel', color: 'red' });
    }
  };

  return (

    <Container mt="xl" style={{ textAlign: 'left', width: '100%' }}>
      <form onSubmit={form.onSubmit(handleCreateTravelSubmit)}>

        <Stack style={{ width: '100%' }} >
          <Button
            variant="filled"
            color={VIAJERO_GREEN}
            onClick={Router.back}
            px="sm"
            w="fit-content"
            radius="md"
            leftSection={<FontAwesomeIcon icon={faChevronLeft} color="black" />}
          />
          <Title mb="lg">
            Create a Travel
          </Title>

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Title  </Text>
          <TextInput {...form.getInputProps('title')} required />

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Description</Text>
          <Textarea {...form.getInputProps('description')} required />

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Max Capacity</Text>
          <NumberInput {...form.getInputProps('maxCap')} min={1} required style={{ maxWidth: 80 }} />

          <Box>
            <DatePicker
              type="range"
              value={selectedDates}
              onChange={setSelectedDates}
              allowSingleDateInRange
           />
          </Box>

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

          <Button 
            type="submit" 
            mt="md" 
            px="sm" 
            radius="md" 
            color={VIAJERO_GREEN} 
            w="fit-content"
            style={{ fontWeight: 600, fontSize: '1rem'}}
            rightSection={<FaCheck />}
            >Create Travel
          </Button>

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