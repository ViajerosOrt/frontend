import { Activity, Travel, TravelDto, useJoinToTravelMutation } from "@/graphql/__generated__/gql";
import { TravelCard } from "../TravelCard/TravelCard";
import { Box, Button, Group, Image, Modal, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VIAJERO_GREEN } from "@/consts";
import { CgProfile } from "react-icons/cg";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { travelImages } from "@/utils";



export const TravelList = ({ travelsDtos }: { travelsDtos: TravelDto[] }) => {
  const [selectedTravelDtO, setSelectedTravelDto] = useState<TravelDto | undefined>(undefined)
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>("");

  return (
    <>
      {
        travelsDtos.map((travelsDto, index) => (
          <TravelCard travelDto={travelsDto}
            key={travelsDto.id}
            imageSrc={travelImages[index % travelImages.length]}
            setSelectedTravelDto={(travelDto) => {
              setSelectedTravelDto(travelDto);
              setSelectedImageSrc(travelImages[index % travelImages.length]);
            }}
          />
        ))
      }

      <TravelDetailsModal selectedTravelDto={selectedTravelDtO} setSelectedTravelDto={setSelectedTravelDto} selectedImageSrc={selectedImageSrc} />
    </>
  )
}


type TravelDetailsModalProps = {
  selectedTravelDto: TravelDto | undefined,
  setSelectedTravelDto: Dispatch<SetStateAction<TravelDto | undefined>>
  selectedImageSrc: string
}

export const TravelDetailsModal = ({ selectedTravelDto, setSelectedTravelDto, selectedImageSrc }: TravelDetailsModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const formattedStartDate = new Date(selectedTravelDto?.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(selectedTravelDto?.finishDate).toLocaleDateString('es-ES');

  const [joinToTravel] = useJoinToTravelMutation({
    refetchQueries: ["travels"]
  });

  const handleJoinTravel = () => {
    joinToTravel({
      variables: {
        travelId: selectedTravelDto?.id || ''
      },
      onCompleted(result) {
        if (result.joinToTravel.id) {
          notifications.show({
            title: 'You were joined to the travel successfully',
            message: `You are now part of ${selectedTravelDto?.travelTitle}`,
            color: 'Green',
          });
          setSelectedTravelDto(undefined)
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
    if (selectedTravelDto) {
      open();
    } else {
      close();
    }
  }, [selectedTravelDto, open, close]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close()
        setTimeout(() => {
          setSelectedTravelDto(undefined);
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
        alt={selectedTravelDto?.travelTitle}
        fit="cover"
        height={200}
      />

      <Box p={16}>
        <Group justify="space-between">
          <Text fw={700} >
            {selectedTravelDto?.travelTitle}
          </Text>
          <Text>
            {formattedStartDate} - {formattedEndDate}
          </Text>
        </Group>
        <Text mb="sm" mt={12}>
          {selectedTravelDto?.travelDescription || "No description available."}
        </Text>

        <ThemeIcon color={VIAJERO_GREEN} miw={70}>
          <CgProfile />
          <Text ml={4}>
            {`${selectedTravelDto?.usersCount} / ${selectedTravelDto?.maxCap}`}
          </Text>
        </ThemeIcon>


        <Box mt={12}>
          <Text fw={600} mb="xs">Activities:</Text>
          <Box mb="sm">
            {selectedTravelDto?.travelActivities?.length ? (
              selectedTravelDto.travelActivities.map((activity: Activity) => (
                <Text key={activity.id} color="dimmed">• {activity.activityName}</Text>
              ))
            ) : (
              <Text color="dimmed">No activities listed.</Text>
            )}
          </Box>
        </Box>
        <Tooltip.Floating label="You already belong to this travel!" disabled={!selectedTravelDto?.isJoined} color={VIAJERO_GREEN}>
          <Box bg="var(--mantine-color-blue-light)" style={{ cursor: 'default' }}>
            <Button variant="filled" color={VIAJERO_GREEN}
              fullWidth mt="md"
              radius="md"
              onClick={handleJoinTravel}
              disabled={!!selectedTravelDto?.isJoined}
            >
              Join
            </Button>
          </Box>
        </Tooltip.Floating>
      </Box >

    </Modal >
  );
};