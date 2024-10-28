import { VIAJERO_GREEN } from "@/consts";
import { Travel } from "@/graphql/__generated__/gql";
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
import { CgProfile } from "react-icons/cg";


export const TravelCard = ({ travel, imageSrc }: { travel: Partial<Travel>, imageSrc: string }) => {
  const { hovered, ref } = useHover();
  const formattedStartDate = new Date(travel.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(travel.finishDate).toLocaleDateString('es-ES');

  return (
    <Grid.Col span={4}>
      <Card
        ref={ref}
        shadow="md"
        radius="md"
        withBorder
        style={{
          transition: 'transform 0.2s ease',
          transform: hovered ? 'scale(1.020)' : 'scale(1)',
        }}
      >
        <Card.Section>
          <Image
            src={imageSrc || "/default-travel.jpg"}
            alt={travel.travelTitle}
            height={200}
          />
        </Card.Section>

        <Group m={12} justify="space-between">
          <Text fw={700}>{travel.travelTitle}</Text>
          <Text size="sm">{formattedStartDate} - {formattedEndDate}</Text>
        </Group>

        <Text m={12}>
          {travel.travelDescription || "No description available."}
        </Text>

        <Button variant="light" color={VIAJERO_GREEN} fullWidth mt="md" radius="md">
          View Details
        </Button>

        <Box pos="absolute">
          <ThemeIcon color={VIAJERO_GREEN} miw={50}>
            <CgProfile />
            <Text ml={4}>
              {travel.maxCap}
            </Text>
          </ThemeIcon>
        </Box>
      </Card>


    </Grid.Col >
  )
};