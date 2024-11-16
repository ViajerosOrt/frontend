import { useQuery } from '@apollo/client';
import { TravelDto, Activity } from "@/graphql/__generated__/gql";
import { Container, Grid, Text, Loader, Box, Modal, Group, ThemeIcon, Tooltip, Button, Image, Title, Tabs, Card } from '@mantine/core';
import { TravelCard } from "../TravelCard/TravelCard";
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { CgProfile } from 'react-icons/cg';
import { VIAJERO_GREEN } from '@/consts';

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
        <>
            <Tabs value={activeTab} onChange={setActiveTab} orientation="horizontal" variant="unstyled">
                <Tabs.List style={{ marginBottom: '10px', marginLeft: '60px', paddingBottom: '20px' }}>
                    <Tabs.Tab value="upcoming" mb="md" style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: VIAJERO_GREEN,
                        padding: '10px 20px',
                        borderRadius: '4px',
                        marginRight: '120px',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        transform: activeTab === 'upcoming' ? 'scale(1.2)' : 'scale(1)', 
                        boxShadow: activeTab === 'upcoming' ? '0 5px 8px rgba(0, 0, 0, 1)' : 'none', 
                    }}
                    >About to start</Tabs.Tab>
                    <Tabs.Tab value="ongoing" mb="md" style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: VIAJERO_GREEN,
                        padding: '10px 20px',
                        borderRadius: '4px',
                        marginRight: '40px',
                        marginLeft: '120px',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        transform: activeTab === 'ongoing' ? 'scale(1.2)' : 'scale(1)', 
                        boxShadow: activeTab === 'ongoing' ? '0 5px 8px rgba(0, 0, 0, 1)' : 'none', 
                    }}>In Progress</Tabs.Tab>
                    <Tabs.Tab value="finished" mb="md" style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: VIAJERO_GREEN,
                        padding: '10px 20px',
                        borderRadius: '4px',
                        marginLeft: '240px',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        transform: activeTab === 'finished' ? 'scale(1.2)' : 'scale(1)', 
                        boxShadow: activeTab === 'finished' ? '0 5px 8px rgba(0, 0, 0, 1)' : 'none', 
                    }}>Ended</Tabs.Tab>
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
                open={() => { }}
                close={() => { }}
            />
        </>
    )
}

type TravelDetailsModalProps = {
    selectedTravel: TravelDto | undefined,
    setSelectedTravel: Dispatch<SetStateAction<TravelDto | undefined>>,
    selectedImageSrc: string,
    open: () => void,
    close: () => void,
};

export const TravelDetailsModal = ({ selectedTravel, setSelectedTravel, selectedImageSrc }: TravelDetailsModalProps) => {
    const [opened, { open, close }] = useDisclosure(false);

    const formattedStartDate = new Date(selectedTravel?.startDate).toLocaleDateString('es-ES');
    const formattedEndDate = new Date(selectedTravel?.finishDate).toLocaleDateString('es-ES');


    useEffect(() => {
        if (selectedTravel) {
            open();
        } else {
            close();
        }
    }, [selectedTravel, open, close]);

    return (
        <Modal
            opened={opened}
            onClose={() => {
                close()
                setTimeout(() => {
                    setSelectedTravel(undefined);
                }, 200);
            }
            }
            withCloseButton={false}
            centered
            padding={0}
            size="lg"
            radius="md"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            transitionProps={{ transition: 'fade', duration: 200 }}
        >
            <Image
                src={selectedImageSrc || "/default-travel.jpg"}
                alt={selectedTravel?.travelTitle}
                fit="cover"
                height={200}
            />

            <Box p={16}>
                <Group justify="space-between">
                    <Text fw={700} >
                        {selectedTravel?.travelTitle}
                    </Text>
                    <Text>
                        {formattedStartDate} - {formattedEndDate}
                    </Text>
                </Group>
                <Text mb="sm" mt={12}>
                    {selectedTravel?.travelDescription || "No description available."}
                </Text>

                <ThemeIcon color={VIAJERO_GREEN} miw={70}>
                    <CgProfile />
                    <Text ml={4}>
                        {`${selectedTravel?.usersCount} / ${selectedTravel?.maxCap}`}
                    </Text>
                </ThemeIcon>


                <Box mt={12}>
                    <Text fw={600} mb="xs">Activities:</Text>
                    <Box mb="sm">
                        {selectedTravel?.travelActivities?.length ? (
                            selectedTravel.travelActivities.map((activity: Activity) => (
                                <Text key={activity.id} color="dimmed">• {activity.activityName}</Text>
                            ))
                        ) : (
                            <Text color="dimmed">No activities listed.</Text>
                        )}
                    </Box>
                </Box>

            </Box >

        </Modal >
    );
};