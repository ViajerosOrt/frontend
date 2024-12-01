import { Activity } from "@/graphql/__generated__/gql";
import { getActivityAvatar } from "@/utils";
import { Avatar } from "@mantine/core";
import { useHover } from "@mantine/hooks";

export function ActivitiesAvatarGroup({ activities, avatarSize = "sm", maxActivitiesToShow = 6 }: { activities: Activity[], avatarSize?: string, maxActivitiesToShow?: number }) {
  const { hovered, ref } = useHover()

  const totalActivitiesCount = activities.length

  return (
    <Avatar.Group
      pos="absolute"
      spacing={hovered ? 4 : 'sm'}
      top={10}
      left={10}
      ref={ref}
      className="z-10 transition-spacing duration-300"
    >
      {activities.slice(0, maxActivitiesToShow).map((activity) => {
        return getActivityAvatar(activity.activityName, avatarSize)
      })}

      {/* If we have more than maxNormalLimitsToShow activities, show a "+" avatar */}
      {totalActivitiesCount > maxActivitiesToShow && (
        <Avatar size={avatarSize}>+{totalActivitiesCount - maxActivitiesToShow}</Avatar>
      )}
    </Avatar.Group>
  )
}