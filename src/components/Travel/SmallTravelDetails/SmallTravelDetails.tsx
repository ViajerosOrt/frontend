import { ViajeroEmptyMessage } from "@/components/ViajeroEmptyMessage/viajeroEmptyMessage";
import { ViajeroLoader } from "@/components/ViajeroLoader/ViajeroLoader";
import { Travel, useUserByIdQuery } from "@/graphql/__generated__/gql";
import { BOLD, SEMI_BOLD, VIAJERO_GREEN } from "@/consts";
import { useAuth } from "@/hooks/useAth";
import {
  Avatar,
  Box,
  Button,
  Card,
  Image,
  Stack,
  Text
} from "@mantine/core";
import { travelImages } from "@/utils";
import { useHover } from "@mantine/hooks";
import { ActivitiesAvatarGroup } from "@/components/Activity/ActivitiesAvatarGroup";

export const SmallTravelDetails = ({ travel, index }: { travel: Travel, index: number }) => {
  const { hovered, ref } = useHover();

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
          src={travelImages[index % travelImages.length] || "/default-travel.jpg"}
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
      <ActivitiesAvatarGroup activities={travel.travelActivities || []} />
    </Card>
  );
}