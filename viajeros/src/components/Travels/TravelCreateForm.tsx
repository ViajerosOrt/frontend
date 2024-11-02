import { CREATE_TRAVEL_MUTATION } from '@/graphql/travels/travel.mutations';
import { GET_ALL_ACTIVITIES } from '@/graphql/activity/activity.mutations';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Container, Stack, Text, Modal, Group, MultiSelect } from '@mantine/core';
import { Calendar, DatePicker } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import useAuthStore from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';

const TravelCreateForm = () => {
  const [createTravel] = useMutation(CREATE_TRAVEL_MUTATION);
  const { data, loading, error } = useQuery(GET_ALL_ACTIVITIES);
  

  const currentUser = useAuthStore((state) => state.currentUser);

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedFinishDate, setSelectedFinishDate] = useState<Date | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const activities = data?.activities || [];

  const form = useForm<travelValues>({
    initialValues: {
      title: '',
      description: '',
      maxCap: 1,
      startDate: new Date(),
      finishDate: new Date(),
      location: {
        longLatPoint: '',
      },
    },
    validate: {
      maxCap: (value) => (value < 1 ? 'Max Capacity must be more than 1' : null),
    },
  });

  const handleCreateTravelSubmit = async (values:  travelValues) => {

    console.log("Creando viaje con valores:", values);

    
    try {

      if (!currentUser?.accessToken?.value) {
        console.error("No user logged in");
        return;
      }

      await createTravel({
        variables: {
          createTravelInput: {
            travelTitle: values.title,
            travelDescription: values.description,
            startDate: selectedStartDate?.toISOString(),
            finishDate: selectedFinishDate?.toISOString(),
            maxCap: values.maxCap,
            isEndable: false,
          },
          createUserId: currentUser.id,
          activitiesId: selectedActivities,
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
      showNotification({ message: 'Error creating the travel', color: 'red' });
      console.error(error);
    }
  };

  const handleClick = () => {
    console.log("click");
    form.onSubmit(handleCreateTravelSubmit)();
    console.log("ak");
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
             data={activities.map((activity: { id: any; activityName: any; }) => ({
              value: activity.id,         
              label: activity.activityName 
            }))}
            placeholder="Select activites for your travel"
            onChange={setSelectedActivities}
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

interface travelValues {
  title: string;
  description: string;
  maxCap: number;
  location: {
    longLatPoint: string;
  };
  startDate: Date | null;
  finishDate: Date | null;
}