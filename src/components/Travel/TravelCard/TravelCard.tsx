import { getDaysPending, getTransportAvatar } from "@/utils";
import { Consts, VIAJERO_GREEN } from "../../../consts/consts";
import { TravelDto } from "../../../graphql/__generated__/gql";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import React from "react";
import { Dispatch, SetStateAction } from "react";
import { CgProfile } from "react-icons/cg";
import { ActivitiesAvatarGroup } from "@/components/Activity/ActivitiesAvatarGroup";
import { BOLD } from "@/consts";

type TravelCardProps = {
  travel: TravelDto,
  imageSrc: string,
  setSelectedTravel: Dispatch<SetStateAction<TravelDto | undefined>>,
  showOpenChatButton?: boolean
}

export const TravelCard = ({ travel, imageSrc, setSelectedTravel, showOpenChatButton = true }: TravelCardProps) => {
  const { hovered, ref } = useHover();
  const userColor = Consts.getColorByPercentage(travel?.usersCount!, travel?.maxCap!);

  const daysPending = getDaysPending(new Date(travel.startDate));

  return (
    <Card
      w="100%"
      ref={ref}
      shadow="md"
      radius="md"
      withBorder
      style={{
        transition: 'transform 0.2s ease',
        transform: hovered ? 'scale(1.020)' : 'scale(1)',
        minHeight: "350px",
        display: "flex",
        flexDirection: "column",
        minWidth: '210px',
        maxWidth: '100%',
        flex: 1,
      }}
    >
      <Card.Section>
        <Image
          src={imageSrc || "/default-travel.jpg"}
          alt={travel.travelTitle}
          height={200}
          style={{ objectFit: "cover", minHeight: '200px', height: '200px' }}
        />
      </Card.Section>


      <Group m={12} justify="space-between">
        <Text fw={BOLD}>{travel.travelTitle}</Text>
        <Stack gap={4} align="flex-start">
          {daysPending > 0 && (
            <Badge color={VIAJERO_GREEN} size="md">
              In {daysPending} {daysPending > 1 ? 'days' : 'day'}
            </Badge>
          )}
        </Stack>
      </Group>

      <Text m={12} truncate lineClamp={2} mih={60} style={{
        overflowX: 'auto',
        maxWidth: '100%',
        display: 'block',
      }}>
        {travel.travelDescription || "No description available."}
      </Text>

      {travel.transport && (
        <Group gap="sm" align="center">
          {getTransportAvatar(travel.transport.name)}
          <Text>{travel.transport.name}</Text>
        </Group>
      )}

      {travel.isJoined && showOpenChatButton ?
        (
          <>
            <Group wrap="nowrap">
              <Button variant="light" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" onClick={() => setSelectedTravel(travel)}>
                View Details
              </Button>
              <Button variant={"filled"} color={"purple"} fullWidth mt="md" radius="md" onClick={() => null}>
                Open Chat
              </Button>
            </Group>
          </>
        )
        :
        <Button variant="light" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" onClick={() => setSelectedTravel(travel)}>
          View Details
        </Button>

      }

      <Box pos="absolute" right={10}>
        <ThemeIcon color={userColor} miw={70}>
          <CgProfile />
          <Text ml={4}>
            {`${travel.usersCount} / ${travel.maxCap}`}
          </Text>
        </ThemeIcon>
      </Box>
      <ActivitiesAvatarGroup activities={travel.travelActivities || []} avatarSize="md" />
    </Card>
  )
};