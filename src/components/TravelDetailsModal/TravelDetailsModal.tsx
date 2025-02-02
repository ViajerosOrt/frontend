import { Box, Button, Group, Image, Modal, Stack, Text, ThemeIcon, Tooltip, ActionIcon, Collapse, Transition } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { getActivityAvatar, getTransportAvatar, travelImages } from "@/utils";
import React from "react";
import { Activity, TravelDto, useJoinToTravelMutation } from "@/graphql/__generated__/gql";
import { Consts } from "@/consts/consts";
import { VIAJERO_GREEN } from "@/consts";
import TravelImage from "../Travel/TravelImages/TravelImage";
import { IoClose, IoEarthOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronDown } from 'lucide-react';



type TravelDetailsModalProps = {
  selectedTravel: TravelDto | undefined,
  setSelectedTravel: Dispatch<SetStateAction<TravelDto | undefined>>
  selectedImageSrc: string,
  showJoinButton?: boolean,
  showMaxCap?: boolean,
}

const LeafletMap = dynamic(() => import('../MapComponents/LeafletMap'), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});

export const TravelDetailsModal = ({ selectedTravel, setSelectedTravel, selectedImageSrc, showJoinButton = true, showMaxCap = true }: TravelDetailsModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [showMap, setShowMap] = useState(false);

  const formattedStartDate = new Date(selectedTravel?.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(selectedTravel?.finishDate).toLocaleDateString('es-ES');

  const userColor = Consts.getColorByPercentage(selectedTravel?.usersCount!, selectedTravel?.maxCap!);

  const [joinToTravel] = useJoinToTravelMutation();
  const [latitude, longitude] = selectedTravel?.travelLocation.longLatPoint.split(',').map(parseFloat) || [];

  const scaleY = {
    in: { opacity: 1, transform: 'scaleY(1)' },
    out: { opacity: 0, transform: 'scaleY(0)' },
    common: { transformOrigin: 'top' },
    transitionProperty: 'transform, opacity',
  };

  const handleJoinTravel = () => {
    joinToTravel({
      variables: {
        travelId: selectedTravel?.id || '',
      },
      refetchQueries: ['Travels'],
      onCompleted(result) {
        if (result.joinToTravel.id) {
          notifications.show({
            title: 'You were joined to the travel successfully',
            message: `You are now part of ${selectedTravel?.travelTitle}`,
            color: 'Green',
          });
          setSelectedTravel(undefined)
        }
      },
      onError(error) {
        notifications.show({
          title: 'Error',
          message: error.message,
          color: 'red',
        });
      }
    })
  }

  useEffect(() => {
    if (selectedTravel) {
      open();
    } else {
      close();
      setShowMap(false);
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
      styles={{
        content: {
          overflowY: 'scroll',
          scrollbarWidth: 'none',
        },
      }}
    >
      <Box style={{ position: 'relative' }}>
        <ActionIcon
          variant="filled"
          color="gray"
          radius="xl"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 10
          }}
          onClick={() => {
            close();
            setTimeout(() => {
              setSelectedTravel(undefined);
            }, 200);
          }}
        >
          <IoClose size={18} />
        </ActionIcon>

        <TravelImage src={selectedTravel?.imageUrl || "/default_travel.jpg"} alt={selectedTravel?.travelTitle || ''} />
      </Box>

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

        {showMaxCap &&
          <ThemeIcon color={userColor} miw={70}>
            <CgProfile />
            <Text ml={4}>
              {`${selectedTravel?.usersCount} / ${selectedTravel?.maxCap}`}
            </Text>
          </ThemeIcon>
        }


        <Box mt={20}>
          {selectedTravel?.transport && (
            <Group gap="sm" align="center">
              {getTransportAvatar(selectedTravel.transport.name)}
              <Text>{selectedTravel.transport.name}</Text>
            </Group>
          )}
        </Box>

        <Box mt={12}>
          <Text fw={600} mb="xs">Activities:</Text>
          <Stack gap={12} mb="sm">
            {selectedTravel?.travelActivities?.length ? (
              selectedTravel.travelActivities.map((activity: Activity) => (
                <Group key={activity.activityName}>
                  {getActivityAvatar(activity.activityName, 'md')}
                  <Text>{activity.activityName}</Text>
                </Group>
              ))
            ) : (
              <Text> No activities listed.</Text>
            )}
          </Stack>
        </Box>


        <Group justify="center" mt="md">
          <ActionIcon
            variant="filled"
            color={VIAJERO_GREEN}
            size="lg"
            radius="xl"
            onClick={() => setShowMap(!showMap)}
            style={{
              border: `2px solid ${VIAJERO_GREEN}`,
              transition: 'all 0.2s ease'
            }}
          >
            <IoEarthOutline size={20} />
          </ActionIcon>
          <ChevronDown
            size={24}
            color={VIAJERO_GREEN}
            style={{
              transform: showMap ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s ease'
            }}
          />
        </Group>

        <Transition
          mounted={!!(showMap && latitude && longitude)}
          transition={scaleY}
          duration={200}
          timingFunction="ease"
        >
          {(transitionStyle) => (
            <Box
              mt={20}
              style={{
                ...transitionStyle,
                borderRadius: "16px",
                overflow: "hidden"
              }}
            >
              <Box
                p={16}
                bg="#f8f9fa"
                style={{
                  borderBottom: '1px solid #eaeaea'
                }}>
                <Group justify="space-between" align="center">
                  <Text fw={600} size="md">Travel Location</Text>
                  <Text size="sm" fw={600} c="dimmed">{selectedTravel?.travelLocation.name}</Text>
                </Group>
              </Box>

              <Box p={16}>
                <Box style={{ height: "300px", overflow: "hidden", borderRadius: "4px", }}>
                  {showMap && latitude && longitude && (
                    <LeafletMap key={`${latitude}-${longitude}-${showMap}`} latitude={latitude} longitude={longitude} />
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Transition>

        {showJoinButton &&
          <Tooltip.Floating label="You already belong to this travel!" disabled={!selectedTravel?.isJoined} color={VIAJERO_GREEN}>
            <Box bg="var(--mantine-color-blue-light)" style={{ cursor: 'default' }}>
              <Button variant="filled" color={VIAJERO_GREEN}
                fullWidth mt="md"
                radius="md"
                onClick={handleJoinTravel}
                disabled={!!selectedTravel?.isJoined}
              >
                Join
              </Button>
            </Box>
          </Tooltip.Floating>
        }
      </Box >


    </Modal >
  );
};