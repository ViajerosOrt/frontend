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
import { useIsMobile } from "@/hooks/useIsMobile";



export default function Travels() {
  const { filters, updateFilters, applyFilters, defaultFilters, data, loading } = useTravelFilters();
  const { isMobile } = useIsMobile();
  // Solo mostramos viajes que cumplan con los siguientes requisitos:
  // Tengan espacio para uno.
  // No esten en progreso (sea posible el unirse)
  // Si el usuario ya se unio, mostramos el viaje sin importar las caracteristicas de arriba.
  const travels = data?.travels.filter((travel) => {
    const hasStarted = new Date(travel.startDate) <= new Date();
    const isFull = travel.maxCap && travel.usersCount && travel.usersCount == travel.maxCap;

    return !hasStarted && !isFull || travel.isJoined;
  });

  const [opened, { open, close }] = useDisclosure(false)

  if (loading) {
    return (
      <ViajeroLoader />
    )
  }

  const TravelButtons = () => (
    isMobile ? (
      <Group grow w="100%" mb="md">
        <Button
          component={Link}
          href="/travels/travelCreate"
          size="md"
          radius="md"
          color={VIAJERO_GREEN}
          leftSection={<FaPlane />}
          fullWidth
        >
          Create Travel
        </Button>
        <Button
          onClick={open}
          size="md"
          radius="md"
          variant="outline"
          color={VIAJERO_GREEN}
          leftSection={<FontAwesomeIcon icon={faFilter} />}
          fullWidth
        >
          Filters
        </Button>
      </Group>
    ) : (
      <Group align="end" justify="space-between" w="100%">
        <Button
          component={Link}
          href="/travels/travelCreate"
          size="md"
          radius="md"
          color={VIAJERO_GREEN}
          rightSection={<FaPlane />}
        >
          Create a new travel
        </Button>

        <ActionIcon
          variant="filled"
          color={VIAJERO_GREEN}
          onClick={open}
          w={100}
          h={40}
          size="md"
          radius="md"
        >
          <Text mr={14} fw={SEMI_BOLD}>Filters</Text>
          <FontAwesomeIcon icon={faFilter} />
        </ActionIcon>
      </Group>
    )
  );

  return (
    <Container size="xl" mt="xl">
        <TravelButtons />

        <TravelFiltersDrawer
          opened={opened}
          close={close}
          filters={filters}
          updateFilters={updateFilters}
          applyFilters={applyFilters}
          defaultFilters={defaultFilters}
        />

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




