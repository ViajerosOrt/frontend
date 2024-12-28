import { gql } from "@apollo/client";

export const GET_TRAVELS = gql`
  query Travels(
    $transportId: String
    $activityIds: [String!]
    $travelName: String
    $endDate: DateTime
    $startDate: DateTime
    $countryName: String
    $creatorId: String
  ) {
    travels(
      transportId: $transportId
      activityIds: $activityIds
      travelName: $travelName
      endDate: $endDate
      startDate: $startDate
      countryName: $countryName
      creatorId: $creatorId
    ) {
      id
      travelTitle
      travelDescription
      startDate
      finishDate
      maxCap
      isJoined
      usersCount
      transport {
        name
        id
      }
      checklist {
        id
        name
        items {
          name
          state
        }
      }
      usersTravelers {
        name
        email
      }
      creatorUser {
        name
        email
      }
      travelActivities {
        id
        activityName
      }
      country
    }
  }
`;
