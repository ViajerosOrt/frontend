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
  console.log("Datos de actividades:", data);
  console.log(data);
  console.log(activities);

  const form = useForm({
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
      title: (value) => (value.length < 5 ? 'Title must contain at least 5 characters' : null),
      maxCap: (value) => (value < 1 ? 'Max Capacity must be more than 1' : null),
      startDate: (value) => (!value ? 'Start date is required' : null),
      finishDate: (value, values) =>
        value <= values.startDate ? 'Finish date cannot be greater than start date' : null,
    },
  });

  const handleSubmit = async (values: { title: any; description: any; maxCap: any; location: { longLatPoint: any; }; }) => {
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
          createUserId: currentUser.accessToken.value,
          activitiesId: [],
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
    } catch (error) {
      showNotification({ message: 'Error creating the travel', color: 'red' });
      console.error(error);
    }
  };

  return (
    <Container mt="xl" style={{ textAlign: 'left', width: '100%' }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack style={{ width: '100%' }}>

          <Text>Title</Text>
          <TextInput {...form.getInputProps('title')} required />

          <Text>Description</Text>
          <Textarea {...form.getInputProps('description')} required />

          <Text>Max Capacity</Text>
          <NumberInput {...form.getInputProps('maxCap')} min={1} required style={{ maxWidth: 80 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            <div style={{ flex: 1, marginRight: '10px' }}>
              <Text>Start Date</Text>
              <DatePicker
                value={selectedStartDate}
                onChange={setSelectedStartDate}
              />
            </div>

            <div style={{ flex: 1, marginLeft: '10px' }}>
              <Text>End Date</Text>
              <DatePicker
                value={selectedFinishDate}
                onChange={setSelectedFinishDate}
              />
            </div>
          </div>

          <Text>Activities</Text>
          <MultiSelect
            data={activities.map((activity: { id: any; activityName: any; }) => ({ value: activity.id, label: activity.activityName }))}
            placeholder="Select activites for your travel"
            {...form.getInputProps('activities')}
          />

          <Text>Coords(longLatPoint)</Text>
          <TextInput {...form.getInputProps('location.longLatPoint')} required />

          <Button type="submit" mt="md" style={{ maxWidth: 120 }}>Create Travel</Button>
          
        </Stack>
      </form>
    </Container>
  );
};

export default TravelCreateForm;
