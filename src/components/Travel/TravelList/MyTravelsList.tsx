import { TravelDto } from "../../../graphql/__generated__/gql";
import { Grid, Text, Tabs, Box, Group, ActionIcon, Button } from '@mantine/core';
import { TravelCard } from "../TravelCard/TravelCard";
import { useState } from 'react';
import { VIAJERO_GREEN, VIAJERO_GREEN_DARK } from '../../../consts/consts';
import React from 'react';
import { TravelDetailsModal } from './TravelList';
import { BOLD, SEMI_BOLD } from "@/consts";
import { useDisclosure } from "@mantine/hooks";
import { TravelFiltersDrawer } from "@/components/TravelFiltersDrawer/TravelsFilterDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FaPlane } from "react-icons/fa";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";

const travelImages = ["/travel_1.jpg", "/travel_2.jpg", "/travel_3.jpg"];

const travelsFiltered = (travels: TravelDto[]) => {
    const now = new Date();

    const upcoming = travels.filter(travel => new Date(travel.startDate) > now);
    const ongoing = travels.filter(travel => new Date(travel.startDate) <= now && new Date(travel.finishDate) > now);
    const finished = travels.filter(travel => new Date(travel.finishDate) < now);

    return { upcoming, ongoing, finished };
};

export const MyTravelsList = (
    { travels,
        loading,
        filters,
        updateFilters,
        applyFilters,
        defaultFilters
    }:
        {
            travels: TravelDto[],
            loading: boolean,
            filters: any,
            updateFilters: any,
            applyFilters: any,
            defaultFilters: any

        }) => {
    const [opened, { open, close }] = useDisclosure(false)

    const [selectedTravel, setSelectedTravel] = useState<TravelDto | undefined>(undefined);
    const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");

    const { upcoming, ongoing, finished } = travelsFiltered(travels);
    const [activeTab, setActiveTab] = useState<string | null>('upcoming');

    if (loading) {
        return (
            <ViajeroLoader />
        )
    }

    return (
        <Box w="100%" mt={20}>
            <Tabs value={activeTab} onChange={setActiveTab} orientation="horizontal" variant="unstyled"  >
                <Tabs.List
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'end',
                        marginBottom: '10px',
                        paddingBottom: '20px',
                    }}>
                    <Button
                        onClick={() => setActiveTab('upcoming')}
                        mt="md"
                        size="md"
                        radius="md"
                        maw={250}
                        color={VIAJERO_GREEN}
                        style={{
                            flex: 1,
                            fontWeight: activeTab === 'upcoming' ? BOLD : SEMI_BOLD,
                        }}
                    >
                        About to start
                    </Button>

                    <Button
                        onClick={() => setActiveTab('ongoing')}
                        mt="md"
                        size="md"
                        radius="md"
                        maw={250}
                        color={VIAJERO_GREEN}
                        rightSection={<FaPlane />}
                        style={{
                            flex: 1,
                            fontWeight: activeTab === 'ongoing' ? BOLD : SEMI_BOLD,
                        }}
                    >
                        In Progress
                    </Button>

                    <Button
                        onClick={() => setActiveTab('finished')}
                        mt="md"
                        size="md"
                        radius="md"
                        maw={250}
                        color={VIAJERO_GREEN}
                        rightSection={<FaPlane />}
                        style={{
                            flex: 1,
                            fontWeight: activeTab === 'finished' ? BOLD : SEMI_BOLD,
                        }}
                    >
                        Ended
                    </Button>
                    <TravelFiltersDrawer
                        opened={opened}
                        close={close}
                        filters={filters}
                        updateFilters={updateFilters}
                        applyFilters={applyFilters}
                        defaultFilters={defaultFilters}
                        showMyTravelNames={true}
                    />

                    <Group wrap="nowrap" mt={8} mx={16}>
                        <ActionIcon variant="filled" color={VIAJERO_GREEN} onClick={open} w={100} h={40}
                            size="md"
                            radius="md">
                            <Text mr={14} fw={SEMI_BOLD}>Filters</Text><FontAwesomeIcon icon={faFilter} />
                        </ActionIcon>
                    </Group>
                </Tabs.List>


                {filters !== defaultFilters && travels.length == 0 ? (< Text > There are no travels matching your filters.</Text >)
                    : (
                        <>
                            <Tabs.Panel value="upcoming" pt="xs">
                                <Grid mt="md" gutter="lg">
                                    {upcoming.length > 0 ? (
                                        upcoming.map((travel, index) => (
                                            <TravelCard travel={travel}
                                                key={travel.id}
                                                imageSrc={travelImages[index % travelImages.length]}
                                                setSelectedTravel={(travel) => {
                                                    setSelectedTravel(travel);
                                                    setSelectedImageSrc(travelImages[index % travelImages.length]);
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Text>You dont have travels about to start.</Text>
                                    )}
                                </Grid>
                            </Tabs.Panel>

                            <Tabs.Panel value="ongoing" pt="xs">
                                <Grid mt="md" gutter="lg">
                                    {ongoing.length > 0 ? (
                                        ongoing.map((travel, index) => (
                                            <TravelCard travel={travel}
                                                key={travel.id}
                                                imageSrc={travelImages[index % travelImages.length]}
                                                setSelectedTravel={(travel) => {
                                                    setSelectedTravel(travel);
                                                    setSelectedImageSrc(travelImages[index % travelImages.length]);
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Text>You dont have travels in progress.</Text>
                                    )}
                                </Grid>

                            </Tabs.Panel>

                            <Tabs.Panel value="finished" pt="xs">
                                <Grid mt="md" gutter="lg">
                                    {finished.length > 0 ? (
                                        finished.map((travel, index) => (
                                            <TravelCard travel={travel}
                                                key={travel.id}
                                                imageSrc={travelImages[index % travelImages.length]}
                                                setSelectedTravel={(travel) => {
                                                    setSelectedTravel(travel);
                                                    setSelectedImageSrc(travelImages[index % travelImages.length]);
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Text>You dont have travels that ended.</Text>
                                    )}

                                </Grid>
                            </Tabs.Panel>
                        </>
                    )}
            </Tabs>

            <TravelDetailsModal
                selectedTravel={selectedTravel}
                setSelectedTravel={setSelectedTravel}
                selectedImageSrc={selectedImageSrc}
            />
        </Box>
    )
}



