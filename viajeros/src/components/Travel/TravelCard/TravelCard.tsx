import { VIAJERO_GREEN } from "@/consts";
import { TravelDto } from "@/graphql/__generated__/gql";
import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { Dispatch, SetStateAction } from "react";
import { CgProfile } from "react-icons/cg";

type TravelCardProps = {
  travel: TravelDto,
  imageSrc: string,
  setSelectedTravel: Dispatch<SetStateAction<TravelDto | undefined>>
}

export const TravelCard = ({ travel, imageSrc, setSelectedTravel }: TravelCardProps) => {
  const { hovered, ref } = useHover();
  const formattedStartDate = new Date(travel.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(travel.finishDate).toLocaleDateString('es-ES');

  return (
    <Grid.Col span={4} style={{ display: 'flex', flexDirection: 'column',  minHeight: "350px", }}>
      <Card
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
            style={{ objectFit: "cover" }}
          />
        </Card.Section>

        <Group m={12} justify="space-between">
          <Text fw={700}>{travel.travelTitle}</Text>
          <Text size="sm">{formattedStartDate} - {formattedEndDate}</Text>
        </Group>

        <Text m={12}  style={{
            overflowX: 'auto',
            maxWidth: '100%',
            display: 'block',
          }}>
          {travel.travelDescription || "No description available."}
        </Text>

        {travel.isJoined ?
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

        <Box pos="absolute">
          <ThemeIcon color={VIAJERO_GREEN} miw={70}>
            <CgProfile />
            <Text ml={4}>
              {`${travel.usersCount} / ${travel.maxCap}`}
            </Text>
          </ThemeIcon>
        </Box>
      </Card>


    </Grid.Col >
  )
};