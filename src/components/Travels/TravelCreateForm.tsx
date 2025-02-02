
import { useCreateTravelMutation, useGetAllActivitiesQuery, useTransportsQuery } from "../../graphql/__generated__/gql";
import { useForm, zodResolver } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Container, Stack, Text, Group, MultiSelect, Paper, Box, Title, Select, useCombobox, Combobox, CheckIcon, PillsInput, Input, Pill, FileInput, Loader } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { notifications, showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { z } from 'zod';
import { VIAJERO_GREEN } from "../../consts/consts";
import { BackButton } from "../BackButton/BackButton";
import { TRAVEL_MAX_DESCRIPTION_LENGTH, TRAVEL_MAX_TITLE_LENGTH } from "../../consts/validators";
import { useRouter } from "next/router";
import { getTransportAvatar } from "@/utils";
import { Countries } from '../MapComponents/Countries';
import React from "react";
import dynamic from "next/dynamic";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useIsMobile } from "@/hooks/useIsMobile";


const travelValuesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50),
  description: z.string().min(1, 'Description is required').max(200),
  maxCap: z.number().min(1, 'Max Capacity must be more than 1'),
  items: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional()
});

const Map = dynamic(() => import('../MapComponents/Map'), {
  ssr: false,
});

const TravelCreateForm = () => {
  //Mutations and Querys
  const [createTravel] = useCreateTravelMutation({
    refetchQueries: ["travels"]
  });

  const router = useRouter()

  const { data: activitiesData } = useGetAllActivitiesQuery();
  const activities = activitiesData?.activities || [];

  const { data: transportData } = useTransportsQuery();
  const transports = transportData?.transports || []
  const parsedTransports = transports.map((transport: { name: any; id: any; }) => {
    return { label: transport.name, value: transport.id };
  });

  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([ new Date(), new Date()]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null)

  //Items isnt done yet 2/11 FS
  const [item, setItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [location, setLocation] = useState<{ coordinates: [number, number]; streetName: string; city: string; state: string } | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile } = useIsMobile();
  const handleFileChange = (file: File | null) => {
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  };

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      maxCap: 1,
      location: location?.coordinates,
      country: '',
    },
    validate: zodResolver(travelValuesSchema),
  });

  const handleLocationSelected = (location: { coordinates: [number, number], streetName: string, city: string, state: string }) => {
    setLocation(location);
  };

  // Add an item to the list (called by handleKeyDown)
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
  const handleCreateTravelSubmit = async () => {
    if (!selectedDates[0] || !selectedDates[1]) {
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

    if (selectedTransportId === null) {
      showNotification({
        message: 'Please select a transport for the travel.',
        color: 'red',
      });
      return;
    }

    setIsLoading(true);

    //We obtain the values from the form const that we defined earlier
    const values = form.values;

    let uploadedImageUrl = null;
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_GRAPHQL_API!, {
          method: 'POST',
          body: formData,
        });
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
    const travelData = {
      travelTitle: values.title,
      travelDescription: values.description,
      startDate: selectedDates[0]?.toISOString(),
      finishDate: selectedDates[1]?.toISOString(),
      maxCap: values.maxCap,
      country: selectedCountry || '',
      isEndable: false,
      countryOfOrigin: 'Uruguay',
      imageUrl: uploadedImageUrl
    };

    const createLocationInput = {
      longLatPoint: location ? `${location.coordinates[0]},${location.coordinates[1]}` : '',
      address: location?.streetName || location?.city || 'No address available',
      name: location?.city || 'Uknown City',
      state: location?.state || 'Unknown State'
    };


    try {
      //We call the mutation to create the travel
      await createTravel({
        variables: {
          createTravelInput: travelData,
          activityId: selectedActivities.length > 0 ? selectedActivities : [],
          transportId: selectedTransportId,
          items: items.length > 0 ? items : [],
          createLocationInput
        },
      });

      showNotification({ message: 'Travel created successfully', color: 'green' });
      form.reset();
      setSelectedDates([null, null]);
      setSelectedActivities([]);
      router.back();

    } catch (error: any) {
      console.error('Create travel error:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
        extraInfo: error.extraInfo
      });
      showNotification({
        message: error.message ? error.message : 'Error creating the travel',
        color: 'red'
      });
    } finally {
      setIsLoading(false);
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
      <form onSubmit={form.onSubmit(handleCreateTravelSubmit)}>
        <Stack w="100%" >
          <Stack gap={4}>
            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}> Title <span style={{ color: 'red' }}>*</span> </Text>
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
            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Description <span style={{ color: 'red' }}>*</span> </Text>
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
            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Country <span style={{ color: 'red' }}>*</span>  </Text>
            <Text size="sm" c="gray">Select the country in which the travel will take place,</Text>

            <Countries defaultCountry={null} value={selectedCountry} onChange={setSelectedCountry} disabled={!!location} />

          </Stack>

          <Map country={selectedCountry!} zoom={7} onLocationSelected={handleLocationSelected} />

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Max Capacity <span style={{ color: 'red' }}>*</span> </Text>
          <Text size="sm" c="gray">The total number of allowed participants.</Text>
          <NumberInput {...form.getInputProps('maxCap')} min={1} required style={{ maxWidth: 80 }} />

          <Text mt={12} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Start and End Date <span style={{ color: 'red' }}>*</span> </Text>
          <Text size="sm" c="gray">The start and end dates of the travel.</Text>
          <Box>
            <DatePicker
              type="range"
              value={selectedDates}
              onChange={setSelectedDates}
              allowSingleDateInRange
            />
          </Box>

          <Box>
            <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>Transport <span style={{ color: 'red' }}>*</span> </Text>
            <Text size="sm" c="gray">An optional transport for the travel.</Text>
            <Select data={parsedTransports} placeholder="Choose one transport" w={isMobile ? '250px' : '30%'} onChange={setSelectedTransportId}
              rightSection={
                selectedTransportId
                  ? getTransportAvatar(transports.find((t: { id: string; }) => t.id === selectedTransportId)?.name || '', "sm")
                  : null
              } />
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
            comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
          />

          <Text style={{ fontWeight: 700, fontSize: '1.5rem' }}>CheckList</Text>
          <Text size="sm" c="gray">A list of essential items to bring in the travel. Each participant will be able to bring one of these.</Text>
          <Text size="sm" c="gray">(You can add multiple items separated by commas by clicking the + button)</Text>
          <Group>
            <TextInput
              style={{ fontWeight: 700, fontSize: '1.5rem', width: isMobile ? '250px' : '30%' }}
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

          <Button variant="filled" type="submit" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" disabled={isLoading} leftSection={isLoading ?
            <Loader size="sm" color="black" /> : null}>
            {isLoading ? 'Creating Travel...' : 'Create Travel'}
          </Button>

        </Stack>
      </form>
    </Container>
  );
};

export default TravelCreateForm;

