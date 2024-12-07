import { TravelList } from "../../components/Travel/TravelList/TravelList";
import { ViajeroEmptyMessage } from "../../components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "../../components/ViajeroLoader/ViajeroLoader";
import { TravelDto } from "../../graphql/__generated__/gql";
import {
  ActionIcon,
  Button,
  Container,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { VIAJERO_GREEN } from "../../consts/consts";
import { FaPlane } from "react-icons/fa";
import React from "react";
import { useTravelFilters } from "@/hooks/useTravelsFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useDisclosure } from "@mantine/hooks";
import { SEMI_BOLD } from "@/consts";
import { TravelFiltersDrawer } from "@/components/TravelFiltersDrawer/TravelsFilterDrawer";



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




