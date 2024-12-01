import { Activity } from "@/graphql/__generated__/gql";
import { getActivityAvatar } from "@/utils";
import { Avatar } from "@mantine/core";
import { useHover } from "@mantine/hooks";

export function ActivitiesAvatarGroup({ activities, avatarSize = "sm" }: { activities: Activity[], avatarSize?: string }) {
  const { hovered, ref } = useHover()
  return (
    <Avatar.Group
      pos="absolute"
      spacing={hovered ? 4 : 'sm'}
      top={10}
      left={10}
      ref={ref}
      className="z-10 transition-spacing duration-300"
    >
      {activities.map((activity) => {
        return getActivityAvatar(activity.activityName, avatarSize)
      })}
    </Avatar.Group>
  )
}