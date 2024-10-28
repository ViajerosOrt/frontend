import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { Travel, useTravelsQuery } from "@/graphql/__generated__/gql";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { CgProfile } from "react-icons/cg";
import { IoIosAirplane } from "react-icons/io";

const travelImages = ["/travel_1.jpg", "/travel_2.jpg", "/travel_3.jpg"]

const TravelItem = ({ travel, imageSrc }: { travel: Partial<Travel>, imageSrc: string }) => {
  const { hovered, ref } = useHover();
  const formattedStartDate = new Date(travel.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(travel.finishDate).toLocaleDateString('es-ES');
  console.log(travel)
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

        <Button variant="light" color="#65a773" fullWidth mt="md" radius="md">
          View Details
        </Button>

        <Box pos="absolute">
          <ThemeIcon color="#65a773" miw={50}>
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

export default function travels() {

  const { data, loading } = useTravelsQuery({
    fetchPolicy: 'cache-and-network'
  })

  const travels = data?.travels

  if (loading) {
    return (
      <ViajeroLoader />
    )
  }

  if (!travels) {
    return <ViajeroEmptyMessage message="No travels where found" />
  }

  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb={20} size={24} ta="center">
        Choose your next travel
      </Title>
      <Grid>
        {travels.map((travel, index) => (
          <TravelItem travel={travel} imageSrc={travelImages[index % travelImages.length]} />
        ))}
      </Grid>
    </Container>
  );
}


