import { useCreateTravelMutation, useGetAllActivitiesQuery } from "@/graphql/__generated__/gql";
import { useForm, zodResolver } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Container, Stack, Text, Group, MultiSelect, Paper, Box, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { notifications, showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { z } from 'zod';
import { VIAJERO_GREEN } from "@/consts";
import { BackButton } from "../BackButton/BackButton";
import { TRAVEL_MAX_DESCRIPTION_LENGTH, TRAVEL_MAX_TITLE_LENGTH } from "@/consts/validators";
import { useRouter } from "next/router";

const travelValuesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50),
  description: z.string().min(1, 'Description is required').max(200),
  maxCap: z.number().min(1, 'Max Capacity must be more than 1'),
  items: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  location: z.object({
    longLatPoint: z.string().min(1, 'Coordinates are required'),
  }),
});

const TravelCreateForm = () => {
  //Mutations and Querys
  const [createTravel] = useCreateTravelMutation({
    refetchQueries: ["travels"]
  });

  const router = useRouter()

  const { data } = useGetAllActivitiesQuery();

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
      location: { longLatPoint: '1234' }, //TODO: CAMBIAR POR LOCATION DEL USUARIO
    },
    validate: zodResolver(travelValuesSchema),
  });

  // Add an item to the list (called by handleKeyDown)
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
      router.back()

    } catch (error: any) {
      console.log(error)
      showNotification({ message: error.message ? error.message : 'Error creating the travel', color: 'red' });
    }
  };

  return (

    <Container mt="xl" ta="left" w="100%" >
      <Group align="center" w="100%">
        <BackButton />
        <Box style={{ flex: 1, textAlign: 'center' }}>
          <Title mb="lg">Create a Travel</Title>
        </Box>
      </Group>
      <Paper p="xl" shadow="md" mt={20} withBorder >
        <form onSubmit={form.onSubmit(handleCreateTravelSubmit)}>
          <Stack w="100%" >
            <Stack gap={4}>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Title  </Text>
              <Text size="sm" c="gray">A unique and descriptive title for your travel.</Text>
              <TextInput {...form.getInputProps('title')} required />
              <Group justify="space-between">
                <Text
                  size="xs"
                  c={
                    (form.values.title?.length || 0) >
                      TRAVEL_MAX_TITLE_LENGTH
                      ? 'red'
                      : 'gray'
                  }
                  ta="start"
                  w="100%"
                >
                  {form.values.title?.length || 0} /{' '}
                  {TRAVEL_MAX_TITLE_LENGTH}
                </Text>
              </Group>
            </Stack>
            <Stack gap={4}>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Description</Text>
              <Text size="sm" c="gray">An overview of the travel plan.</Text>
              <Textarea {...form.getInputProps('description')} required />
              <Group justify="space-between">
                <Text
                  size="xs"
                  c={
                    (form.values.description?.length || 0) >
                      TRAVEL_MAX_DESCRIPTION_LENGTH
                      ? 'red'
                      : 'gray'
                  }
                  ta="start"
                  w="100%"
                >
                  {form.values.description?.length || 0} /{' '}
                  {TRAVEL_MAX_DESCRIPTION_LENGTH}
                </Text>
              </Group>
            </Stack>

            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Max Capacity</Text>
            <Text size="sm" c="gray">The total number of allowed participants.</Text>
            <NumberInput {...form.getInputProps('maxCap')} min={1} required style={{ maxWidth: 80 }} />

            <Text mt={12} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Start and End Date</Text>
            <Text size="sm" c="gray">The start and end dates of the travel.</Text>
            <Box>
              <DatePicker
                type="range"
                value={selectedDates}
                onChange={setSelectedDates}
                allowSingleDateInRange
              />
            </Box>

            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Activities</Text>
            <Text size="sm" c="gray">A selection of activities included in the travel.</Text>
            <MultiSelect
              data={activities.map((
                activity: { id: any; activityName: any; }) => ({
                  value: activity.id,
                  label: activity.activityName
                }))}
              placeholder="Select activites for your travel"
              onChange={setSelectedActivities}
              w="60%"
              style={{ fontWeight: 700, fontSize: '1.5rem' }}
            />

            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>CheckList</Text>
            <Text size="sm" c="gray">A list of essential items to bring in the travel. Each participant will be able to bring one of these.</Text>
            <Group>
              <TextInput
                style={{ fontWeight: 700, fontSize: '1.5rem', width: '30%' }}
                value={item}
                onChange={(e) => setItem(e.currentTarget.value)}
                placeholder="Add an item to your checklist"
              />
              <Button variant="outline" color={VIAJERO_GREEN} onClick={handleAddItem}>
                +
              </Button>
            </Group>
            <Text size="sm" c="gray">Your created items from for the checklis:</Text>
            <MultiSelect
              data={items.map((i) => ({ value: i, label: i }))}
              value={items}
              onChange={setItems}
              placeholder="Selected Items"
              clearable
              searchable
            />

            <Button variant="filled" type="submit" color={VIAJERO_GREEN} fullWidth mt="md" radius="md">
              Create Travel
            </Button>

          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default TravelCreateForm;

