
import { useCreateTravelMutation, useGetAllActivitiesQuery, useTransportsQuery, useTravelQuery, useUpdateTravelMutation } from "../../graphql/__generated__/gql";
import { useForm, zodResolver } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Container, Stack, Text, Group, MultiSelect, Paper, Box, Title, Select, useCombobox, Combobox, CheckIcon, PillsInput, Input, Pill, Loader, FileInput } from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { notifications, showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { VIAJERO_GREEN } from "../../consts/consts";
import { BackButton } from "../BackButton/BackButton";
import { TRAVEL_MAX_DESCRIPTION_LENGTH, TRAVEL_MAX_TITLE_LENGTH } from "../../consts/validators";
import { useRouter } from "next/router";
import { getTransportAvatar } from "@/utils";
import { Countries } from '../MapComponents/Countries';
import React from "react";
import dynamic from "next/dynamic";
import { AiOutlineCloudUpload } from "react-icons/ai";

const travelValuesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50),
  description: z.string().min(1, 'Description is required').max(200),
  maxCap: z.number().min(1, 'Max Capacity must be more than 1'),
  items: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  startDate: z.date(),
  finishDate: z.date(),
});

const Map = dynamic(() => import('../MapComponents/Map'), {
  ssr: false,
});

const TravelUpdateForm = ({ travelId }: { travelId: string }) => {
  const [updateTravel] = useUpdateTravelMutation({
    refetchQueries: ["travels"]
  });
  const { data: travelData } = useTravelQuery({
    variables: {
      id: travelId
    }
  });
  const [isLoadingFormSubmit, setIsLoadingFormSubmit] = useState(false);
  const travel = travelData?.travel

  const router = useRouter()

  const { data: activitiesData } = useGetAllActivitiesQuery();
  const activities = activitiesData?.activities || [];

  const { data: transportData } = useTransportsQuery();
  const transports = transportData?.transports || []
  const parsedTransports = transports.map((transport) => {
    return { label: transport.name, value: transport.id };
  });

  //Items isnt done yet 2/11 FS
  const [item, setItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [location, setLocation] = useState<{ coordinates: [number, number]; streetName: string; city: string; state: string } | null>(null);
  const [defaultCoordinates, setDefaultCoordinates] = useState<[number, number] | null>(null);

  const form = useForm({
    initialValues: {
      title: travel?.travelTitle || '',
      description: travel?.travelDescription || '',
      maxCap: travel?.maxCap || 1,
      location: travel?.travelLocation || location?.coordinates,
      country: travel?.country || '',
      startDate: travel?.startDate!,
      finishDate: travel?.finishDate!,
      transport: travel?.transport?.id || null,
      activities: travel?.travelActivities?.map((activity) => activity.id) || [],
    },
    validate: zodResolver(travelValuesSchema),
  });

  const handleLocationSelected = (location: { coordinates: [number, number], streetName: string, city: string, state: string }) => {
    setLocation(location);
  };

  useEffect(() => {
    if (travel) {
      form.setValues({
        title: travel?.travelTitle || '',
        description: travel?.travelDescription || '',
        maxCap: travel?.maxCap || 1,
        location: travel?.travelLocation || location?.coordinates,
        country: travel?.country || '',
        startDate: new Date(travel?.startDate!),
        finishDate: new Date(travel?.finishDate!),
        transport: travel?.transport?.id || null,
        activities: travel?.travelActivities?.map((activity) => activity.id) || [],
      });
      if (travel?.travelLocation) {
        const longLatPoint = travel?.travelLocation.longLatPoint.split(',').map(Number) as [number, number]
        setLocation({
          coordinates: longLatPoint,
          streetName: travel?.travelLocation.address,
          city: travel?.travelLocation.name,
          state: travel?.travelLocation.state
        })
        setDefaultCoordinates(longLatPoint)
        setSelectedCountry(travel?.country!)
        setItems(travel?.checklist?.items?.map((item) => item.name) || [])
      }
    }
  }, [travel])

  const handleAddItem = () => {
    if (item.trim() === '') {
      return;
    }
    // This is for the case they add multiple items separated by commas
    const itemsArray = item.split(',')
    itemsArray.forEach(item => {
      //Validation to see if the item is already in the list, then dont add it
      if (items.includes(item)) {
        notifications.show({
          title: 'Warning!',
          message: `You cant add the same item twice`,
          color: 'yellow',
        });

        return;
      }
    })

    setItems((prevItems) => [...prevItems, ...itemsArray]);
    setItem('');
  };
  //Principal function to send the travel to the data base
  const handleUpdateTravelSubmit = async () => {
    if (!form.values.startDate || !form.values.finishDate) {
      showNotification({
        message: 'Please select both start and end dates for the travel.',
        color: 'red',
      });
      return;
    }

    if (location === null) {
      showNotification({
        message: 'Please select a location for the travel.',
        color: 'red',
      });
      return;
    }

    if (form.values.transport === null) {
      showNotification({
        message: 'Please select a transport for the travel.',
        color: 'red',
      });
      return;
    }

    try {
      //We call the mutation to create the travel
      setIsLoadingFormSubmit(true);
      let uploadedImageUrl = null;
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const uploadResponse = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_GRAPHQL_API!, {
            method: 'POST',
            body: formData,
          });
          console.log(uploadResponse)
          if (!uploadResponse.ok) {
            console.log('Error');
            throw new Error('Failed to upload image');
          }

          const uploadResult = await uploadResponse.json();
          uploadedImageUrl = uploadResult.url;
        } catch (error) {
          console.log('Upload error details:', error);
          showNotification({
            message: `Error uploading image: ${error}`,
            color: 'red',
          });
          return;
        }
      }

      const values = form.values;

      const travelData = {
        id: travelId,
        travelTitle: values.title,
        travelDescription: values.description,
        startDate: values.startDate,
        finishDate: values.finishDate,
        maxCap: values.maxCap,
        country: selectedCountry || '',
        isEndable: false,
        imageUrl: uploadedImageUrl
      };

      await updateTravel({
        variables: {
          updateTravelInput: travelData,
          activityId: form.values.activities.length > 0 ? form.values.activities : [],
          items: items.length > 0 ? items : [],
          transportId: form.values.transport,
          updateLocationInput: {
            longLatPoint: `${location?.coordinates[0]},${location?.coordinates[1]}`,
            address: location?.streetName!,
            name: location?.city!,
            state: location?.state!
          },
        },
      });

      showNotification({ message: 'Travel updated sucesfully', color: 'green' });
      form.reset();

      router.back()

    } catch (error: any) {

      showNotification({ message: error.message ? error.message : 'Error creating the travel', color: 'red' });
    } finally {
      setIsLoadingFormSubmit(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  };


  return (
    <Container mt="xl" ta="left" w="100%" >
      <Group align="center" w="100%">
        <BackButton />
        <Box style={{ flex: 1, textAlign: 'center' }}>
          <Title mb="lg">Update your Travel</Title>
        </Box>
      </Group>
      <Paper p="xl" shadow="md" mt={20} withBorder >
        <form onSubmit={form.onSubmit(handleUpdateTravelSubmit)}>
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

            <Stack gap={4}>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Image</Text>
              <Text size="sm" c="gray">Upload an image for your travel!</Text>
              <FileInput
                accept="image/*"
                onChange={handleFileChange}
                leftSection={<AiOutlineCloudUpload size={20} />}
                placeholder="Upload image"
                radius="md"
                size="sm"
                styles={{
                  input: {
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'var(--mantine-color-blue-filled)'
                    }
                  },
                  section: {
                    color: 'var(--mantine-color-dimmed)',
                    '&:hover': {
                      color: 'var(--mantine-color-blue-filled)'
                    }
                  }
                }}
              />
            </Stack>

            <Stack gap={4}>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Country</Text>
              <Text size="sm" c="gray">Select the country in which the travel will take place,</Text>

              <Countries defaultCountry={travel?.country!} value={selectedCountry} onChange={setSelectedCountry} disabled={false} />

            </Stack>

            <Map country={selectedCountry || travel?.country!} zoom={7} onLocationSelected={handleLocationSelected} defaultCoordinates={defaultCoordinates} />

            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Max Capacity</Text>
            <Text size="sm" c="gray">The total number of allowed participants.</Text>
            <NumberInput {...form.getInputProps('maxCap')} min={1} required style={{ maxWidth: 80 }} />

            <Text mt={12} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Start and End Date</Text>
            <Text size="sm" c="gray">The start and end dates of the travel.</Text>
            <Group>
              <DatePickerInput
                {...form.getInputProps('startDate')}
              />
              <DatePickerInput
                {...form.getInputProps('finishDate')}
              />
            </Group>

            <Box>
              <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Transport</Text>
              <Text size="sm" c="gray">An optional transport for the travel.</Text>
              <Select
                {...form.getInputProps('transport')}
                data={parsedTransports} placeholder="Choose one transport" w="30%"
                rightSection={
                  form.values.transport
                    ? getTransportAvatar(transports.find(t => t.id === form.values.transport)?.name || '', "sm")
                    : null
                } />
            </Box>

            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Activities</Text>
            <Text size="sm" c="gray">A selection of activities included in the travel.</Text>
            <MultiSelect
              {...form.getInputProps('activities')}
              data={activities.map((
                activity: { id: any; activityName: any; }) => ({
                  value: activity.id,
                  label: activity.activityName
                }))}
              placeholder="Select activites for your travel"
              w="60%"
              style={{ fontWeight: 700, fontSize: '1.5rem' }}
              comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
            />

            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>CheckList</Text>
            <Text size="sm" c="gray">A list of essential items to bring in the travel. Each participant will be able to bring one of these.</Text>
            <Text size="sm" c="gray">(You can add multiple items separated by commas by clicking the + button)</Text>

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
              comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
            />

            <Button variant="filled" type="submit" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" disabled={isLoadingFormSubmit} leftSection={isLoadingFormSubmit ?
              <Loader size="sm" color="black" /> : null}>
              {isLoadingFormSubmit ? 'Updating Travel...' : 'Update Travel'}
            </Button>

          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default TravelUpdateForm;

