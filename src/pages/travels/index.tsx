import { TravelList } from "../../components/Travel/TravelList/TravelList";
import { ViajeroEmptyMessage } from "../../components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "../../components/ViajeroLoader/ViajeroLoader";
import { Travel, TravelDto, useGetAllActivitiesQuery, useTransportsQuery, useTravelsQuery } from "../../graphql/__generated__/gql";
import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  Group,
  MultiSelect,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { VIAJERO_GREEN } from "../../consts/consts";
import { FaPlane } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { TravelFilters, useTravelFilters } from "@/hooks/useTravelsFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useDisclosure } from "@mantine/hooks";
import { BOLD, SEMI_BOLD } from "@/consts";
import { useForm } from "@mantine/form";
import { getTransportAvatar } from "@/utils";
import { DatePicker } from "@mantine/dates";



export default function Travels() {



  const { filters, updateFilters, applyFilters, defaultFilters, data, loading } = useTravelFilters();

  const travels = data?.travels

  const [opened, { open, close }] = useDisclosure(false)

  if (loading) {
    return (
      <ViajeroLoader />
    )
  }

  return (
    <Container size="xl" mt="xl">

      <Group align="end" justify="space-between">
        <Button
          component={Link}
          href="/travels/travelCreate"
          mt="md"
          size="md"
          radius="md"
          color={VIAJERO_GREEN}
          rightSection={<FaPlane />}
        >
          Create a new travel
        </Button>

        <TravelFiltersDrawer
          opened={opened}
          close={close}
          filters={filters}
          updateFilters={updateFilters}
          applyFilters={applyFilters}
          defaultFilters={defaultFilters}
        />

        <Group wrap="nowrap" mt={8} mx={16}>
          <ActionIcon variant="filled" color={VIAJERO_GREEN} onClick={open} w={100} h={40}
            size="md"
            radius="md">
            <Text mr={14} fw={SEMI_BOLD}>Filters</Text><FontAwesomeIcon icon={faFilter} />
          </ActionIcon>
        </Group>
      </Group>


      <Title order={2} mb={20} size={24} ta="center">
        Choose your next travel
      </Title>
      {!travels || travels.length === 0 ? (
        <ViajeroEmptyMessage message="No travels were found" />
      ) : (
        <Grid>
          <TravelList travels={travels as TravelDto[]} />
        </Grid >
      )
      }

    </Container >
  );
}


export const TravelFiltersDrawer = (
  { opened,
    close,
    filters,
    updateFilters,
    applyFilters,
    defaultFilters
  }
    :
    {
      opened: boolean,
      close: () => void,
      filters: TravelFilters,
      updateFilters: (field: string, value: any) => void,
      applyFilters: (newFilters: TravelFilters) => void,
      defaultFilters: TravelFilters
    },) => {
  // Activities
  const { data: activitiesData } = useGetAllActivitiesQuery();
  const activities = activitiesData?.activities || [];

  // Transports
  const { data: transportData } = useTransportsQuery();
  const transports = transportData?.transports || []
  const parsedTransports = transports.map((transport) => {
    return { label: transport.name, value: transport.id };
  });

  // Travel names
  const { data } = useTravelsQuery({
  })
  const travelTitles = data?.travels.map((travel) => travel.travelTitle)

  // Show Dates states
  const [showStartDate, setShowStartDate] = useState<boolean>(false);
  const [showEndDate, setShowEndDate] = useState<boolean>(false);

  const form = useForm({
    initialValues: filters,
  });

  const handleApplyFilters = () => {
    const updatedFilters = form.values;

    Object.entries(updatedFilters).forEach(([key, value]) => {
      updateFilters(key as keyof TravelFilters, value);
    });

    applyFilters(updatedFilters);
    close()
  };
  console.log(form.values)
  return (
    <Drawer
      opened={opened}
      onClose={handleApplyFilters}
      position='right'
      size='lg'
    >
      <form>
        <Stack>
          <Stack gap={4} mb={20}>
            <Title order={6} >
              Transport
            </Title>
            <Text size="sm" c="gray">The type of transport used in the travel</Text>
            <Select
              {...form.getInputProps("transportId")}
              data={parsedTransports} placeholder="Choose one transport"
              rightSection={
                form.values.transportId
                  ? getTransportAvatar(transports.find(t => t.id === form.values.transportId)?.name || '', "sm")
                  : null
              } />
          </Stack>

          <Stack gap={4} mb={20}>
            <Title order={6}>
              Activities
            </Title>
            <Text size="sm" c="gray">The activities related to the travel</Text>
            <MultiSelect
              {...form.getInputProps("activityIds")}
              data={activities.map((
                activity: { id: any; activityName: any; }) => ({
                  value: activity.id,
                  label: activity.activityName
                }))}

              placeholder="Select activites for your travel"
              style={{ fontSize: '1.5rem' }}
              comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }} />
          </Stack>

          <Stack gap={4} mb={20}>
            <Title order={6}>
              Travel title
            </Title>
            <Text size="sm" c="gray">The title of the activity</Text>
            <Autocomplete placeholder="Write a travel title" {...form.getInputProps("travelName")} data={travelTitles}
              comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
            />
          </Stack>
          <Stack gap={4} mb={20}>
            <Switch
              color={VIAJERO_GREEN}
              checked={showStartDate}
              label="Select start date"
              onChange={(event) => setShowStartDate(event.currentTarget.checked)}
            />
            <Text size="sm" c="gray">
              The start date of the trip.
              Selecting a date will show all travels starting after the date.
            </Text>
            {showStartDate && <DatePicker  {...form.getInputProps("startDate")} />}
          </Stack>
          <Stack gap={4} mb={20}>
            <Switch
              color={VIAJERO_GREEN}
              checked={showEndDate}
              label="Select end date"
              onChange={(event) => setShowEndDate(event.currentTarget.checked)}
            />
            <Text size="sm" c="gray">
              The end date of the trip.
              Selecting a date will show all travels ending before the date.
            </Text>
            {showEndDate && <DatePicker  {...form.getInputProps("endDate")} />}
          </Stack>
          <Stack align="center">
            <Button variant="filled" w="50%" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" onClick={() => {
              form.setValues(defaultFilters);
              setShowStartDate(false);
              setShowEndDate(false);
            }}>
              Reset filters
            </Button>
          </Stack>
        </Stack>
      </form>
    </Drawer >
  )
}

