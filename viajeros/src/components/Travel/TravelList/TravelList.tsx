import { Activity, Travel, useJoinToTravelMutation } from "@/graphql/__generated__/gql";
import { TravelCard } from "../TravelCard/TravelCard";
import { Box, Button, Group, Image, Modal, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VIAJERO_GREEN } from "@/consts";
import { CgProfile } from "react-icons/cg";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

const travelImages = ["/travel_1.jpg", "/travel_2.jpg", "/travel_3.jpg"]

export const TravelList = ({ travels }: { travels: Travel[] }) => {
  const [selectedTravel, setSelectedTravel] = useState<Travel | undefined>(undefined)
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");

  return (
    <>
      {
        travels.map((travel, index) => (
          <TravelCard travel={travel}
          key={travel.id}
          imageSrc={travelImages[index % travelImages.length]}
          setSelectedTravel={(travel) => {
            setSelectedTravel(travel);
            setSelectedImageSrc(travelImages[index % travelImages.length]);
          }}
        />
      ))
    }

      <TravelDetailsModal selectedTravel={selectedTravel} setSelectedTravel={setSelectedTravel} selectedImageSrc={selectedImageSrc} />
    </>
  )
}


type TravelDetailsModalProps = {
  selectedTravel: Travel | undefined,
  setSelectedTravel: Dispatch<SetStateAction<Travel | undefined>>
  selectedImageSrc: string
}

export const TravelDetailsModal = ({ selectedTravel, setSelectedTravel, selectedImageSrc }: TravelDetailsModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const formattedStartDate = new Date(selectedTravel?.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(selectedTravel?.finishDate).toLocaleDateString('es-ES');

  const [joinToTravel] = useJoinToTravelMutation({
    refetchQueries: ["travels"]
  });

  const handleJoinTravel = () => {
    joinToTravel({
      variables: {
        travelId: selectedTravel?.id || ''
      },
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
      </Box >

    </Modal >
  );
};