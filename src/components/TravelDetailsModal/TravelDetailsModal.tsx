import { Box, Button, Group, Image, Modal, Stack, Text, ThemeIcon, Tooltip, ActionIcon } from "@mantine/core";
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
import { IoClose } from "react-icons/io5";
import dynamic from "next/dynamic";



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

  const formattedStartDate = new Date(selectedTravel?.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(selectedTravel?.finishDate).toLocaleDateString('es-ES');

  const userColor = Consts.getColorByPercentage(selectedTravel?.usersCount!, selectedTravel?.maxCap!);

  const [joinToTravel] = useJoinToTravelMutation();
  const [latitude, longitude] = selectedTravel?.travelLocation.longLatPoint.split(',').map(parseFloat) || [];

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

      {latitude && longitude && (
        <Box mt={20} p={16} h={300} w="100%"
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden"
          }}>
          <Text fw={600} mb={8} size="md">Travel location</Text>
          <Box style={{ height: "300px", borderRadius: "8px", overflow: "hidden" }}>
            <LeafletMap latitude={latitude} longitude={longitude} />
          </Box>
        </Box>
      )}
    </Modal >
  );
};