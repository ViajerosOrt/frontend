import { Travel } from "@/graphql/__generated__/gql";
import { BOLD, VIAJERO_GREEN } from "@/consts";
import {
  Box,
  Card,
  Image,
  Stack,
  Text,
  ThemeIcon
} from "@mantine/core";
import { travelImages } from "@/utils";
import { useHover } from "@mantine/hooks";
import { ActivitiesAvatarGroup } from "@/components/Activity/ActivitiesAvatarGroup";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";

export const SmallTravelDetails = ({ travel, index, showEdit }: { travel: Travel, index: number, showEdit: boolean }) => {
  const { hovered, ref } = useHover();
  const router = useRouter();
  const formattedStartDate = new Date(travel.startDate).toLocaleDateString('es-ES');
  const formattedEndDate = new Date(travel.finishDate).toLocaleDateString('es-ES');

  return (
    <Card
      ref={ref}
      shadow="md"
      radius="md"
      withBorder
      mah={300}
      style={{
        transition: 'transform 0.2s ease',
        transform: hovered ? 'scale(1.020)' : 'scale(1)',
      }}
    >
      <Card.Section>
        <Image
          h={180}
          src={travel.imageUrl || travelImages[index % travelImages.length] || "/default_travel.jpg"}
          fallbackSrc="/default-travel.jpg"
          alt={travel.travelTitle}
        />
      </Card.Section>
      <Stack m={8} gap={4}>
        <Text fw={BOLD} size="sm">{travel.travelTitle}</Text>
        <Text size="xs">{formattedStartDate} - {formattedEndDate}</Text>
      </Stack>
      <Text m={8} size="xs" truncate lineClamp={2} mih={10}>
        {travel.travelDescription || "No description available."}
      </Text>
      <Box pos="absolute" top={8} right={8}>
        <ThemeIcon
          size="xl"
          radius="xl"
          variant="filled"
          color={VIAJERO_GREEN}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/myTravels/edit/${travel.id}`)
          }}
        >
          <FaEdit />
        </ThemeIcon>
      </Box>
      <ActivitiesAvatarGroup activities={travel.travelActivities || []} />
    </Card>
  );
}