import { TravelDto, Activity } from "../../../graphql/__generated__/gql";
import { Grid, Text, Tabs, Box } from '@mantine/core';
import { TravelCard } from "../TravelCard/TravelCard";
import { useState } from 'react';
import { VIAJERO_GREEN, VIAJERO_GREEN_DARK } from '../../../consts/consts';
import React from 'react';
import { TravelDetailsModal } from './TravelList';
import { BOLD } from "@/consts";

const travelImages = ["/travel_1.jpg", "/travel_2.jpg", "/travel_3.jpg"];


const travelsFiltered = (travels: TravelDto[]) => {
    const now = new Date();

    const upcoming = travels.filter(travel => new Date(travel.startDate) > now);
    const ongoing = travels.filter(travel => new Date(travel.startDate) <= now && new Date(travel.finishDate) > now);
    const finished = travels.filter(travel => new Date(travel.finishDate) < now);

    return { upcoming, ongoing, finished };
};

export const MyTravelsList = ({ travels }: { travels: TravelDto[] }) => {
    const [selectedTravel, setSelectedTravel] = useState<TravelDto | undefined>(undefined);
    const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");

    const { upcoming, ongoing, finished } = travelsFiltered(travels);
    const [activeTab, setActiveTab] = useState<string | null>('upcoming');

    return (
        <Box w="100%" mt={20}>
            <Tabs value={activeTab} onChange={setActiveTab} orientation="horizontal" variant="unstyled"  >
                <Tabs.List
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        marginLeft: '60px',
                        paddingBottom: '20px',
                    }}>
                    <Tabs.Tab
                        value="upcoming"
                        mb="md"
                        mr={120}
                        px={15}
                        py={20}
                        fw={BOLD}
                        bg={activeTab === 'upcoming' ? VIAJERO_GREEN_DARK : VIAJERO_GREEN}
                        style={{
                            flex: 1,
                            fontSize: '14px',
                            borderRadius: 10,
                            color: 'white',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                            transform: activeTab === 'upcoming' ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.transform = "scale(1.17)";
                        }}
                        onMouseLeave={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.transform = "scale(1)";
                        }}
                    >About to start</Tabs.Tab>

                    <Tabs.Tab value="ongoing" mb="md"
                        px={10}
                        py={20}
                        ml={120}
                        mr={40}
                        fw={BOLD}
                        bg={activeTab === 'ongoing' ? VIAJERO_GREEN_DARK : VIAJERO_GREEN}
                        style={{
                            flex: 1,
                            fontSize: '14px',
                            borderRadius: 10,
                            color: 'white',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                            transform: activeTab === 'upcoming' ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.transform = "scale(1.17)";
                        }}
                        onMouseLeave={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.transform = "scale(1)";
                        }}
                    >In Progress</Tabs.Tab>

                    <Tabs.Tab value="finished" mb="md"
                        ml={240}
                        px={10}
                        py={20}
                        fw={BOLD}
                        bg={activeTab === 'finished' ? VIAJERO_GREEN_DARK : VIAJERO_GREEN}
                        style={{
                            flex: 1,
                            fontSize: '14px',
                            borderRadius: 10,
                            color: 'white',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                            transform: activeTab === 'upcoming' ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.transform = "scale(1.17)";
                        }}
                        onMouseLeave={(e) => {
                            const target = e.target as HTMLElement;
                            target.style.transform = "scale(1)";
                        }}
                    >Ended</Tabs.Tab>

                </Tabs.List>

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
            </Tabs>

            <TravelDetailsModal
                selectedTravel={selectedTravel}
                setSelectedTravel={setSelectedTravel}
                selectedImageSrc={selectedImageSrc}
            />
        </Box>
    )
}



