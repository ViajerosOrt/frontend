import { useGetAllActivitiesQuery, useTransportsQuery, useTravelsQuery } from "../../graphql/__generated__/gql";
import {
  Autocomplete,
  Button,
  Drawer,
  MultiSelect,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { VIAJERO_GREEN } from "../../consts/consts";
import React, { useState } from "react";
import { TravelFilters } from "@/hooks/useTravelsFilters";
import { useForm } from "@mantine/form";
import { getTransportAvatar } from "@/utils";
import { DatePicker } from "@mantine/dates";
import { useAuth } from "@/hooks/useAth";

export const TravelFiltersDrawer = (
  { opened,
    close,
    filters,
    updateFilters,
    applyFilters,
    defaultFilters,
    showMyTravelNames = false
  }
    :
    {
      opened: boolean,
      close: () => void,
      filters: TravelFilters,
      updateFilters: (field: string, value: any) => void,
      applyFilters: (newFilters: TravelFilters) => void,
      defaultFilters: TravelFilters
      showMyTravelNames?: boolean
    },) => {
  const { currentUser } = useAuth()

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
  const travels = showMyTravelNames ? data?.travels?.filter((travel) => travel.creatorUser.email == currentUser?.email) : data?.travels
  const travelTitles = travels?.map((travel) => travel.travelTitle)
  const uniqueTravelTitles = Array.from(new Set(travelTitles));

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
            <Autocomplete placeholder="Write a travel title" {...form.getInputProps("travelName")} data={uniqueTravelTitles}
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