import { ActivitiesAvatarGroup } from "@/components/Activity/ActivitiesAvatarGroup";
import { VIAJERO_GREEN } from "@/consts";
import { Travel, TravelDto } from "@/graphql/__generated__/gql";
import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { Dispatch, SetStateAction } from "react";
import { CgProfile } from "react-icons/cg";

type TravelCardProps = {
  travelDto: TravelDto,
  imageSrc: string,
  setSelectedTravelDto: Dispatch<SetStateAction<TravelDto | undefined>>
}

export const TravelCard = ({ travelDto, imageSrc, setSelectedTravelDto }: TravelCardProps) => {
  const { hovered, ref } = useHover();
  const formattedStartDate = new Date(travelDto.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(travelDto.finishDate).toLocaleDateString('es-ES');

  return (
    <Grid.Col span={4}>
      <Card
        ref={ref}
        shadow="md"
        radius="md"
        withBorder
        style={{
          transition: 'transform 0.2s ease',
          transform: hovered ? 'scale(1.020)' : 'scale(1)'
        }}
      >
        <Card.Section>
          <Image
            src={imageSrc || "/default-travel.jpg"}
            alt={travelDto.travelTitle}
            height={200}
          />
        </Card.Section>

        <Stack m={12} justify="space-between">
          <Text fw={700}>{travelDto.travelTitle}</Text>
          <Text size="sm">{formattedStartDate} - {formattedEndDate}</Text>
        </Stack>

        <Text m={12} truncate lineClamp={2} mih={60}>
          {travelDto.travelDescription || "No description available."}
        </Text>

        {travelDto.isJoined ?
          (
            <>
              <Group wrap="nowrap">
                <Button variant="light" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" onClick={() => setSelectedTravelDto(travelDto)}>
                  View Details
                </Button>
                <Button variant={"filled"} color={"purple"} fullWidth mt="md" radius="md" onClick={() => null}>
                  Open Chat
                </Button>
              </Group>
            </>
          )
          :
          <Button variant="light" color={VIAJERO_GREEN} fullWidth mt="md" radius="md" onClick={() => setSelectedTravelDto(travelDto)}>
            View Details
          </Button>

        }

        <Box pos="absolute" right={20}>
          <ThemeIcon color={VIAJERO_GREEN} miw={70}>
            <CgProfile />
            <Text ml={4}>
              {`${travelDto.usersCount} / ${travelDto.maxCap}`}
            </Text>
          </ThemeIcon>
        </Box>
        <ActivitiesAvatarGroup activities={travelDto.travelActivities || []} avatarSize="md" />
      </Card>
    </Grid.Col >
  )
};