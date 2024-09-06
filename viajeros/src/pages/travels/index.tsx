import { gql, useApolloClient, useQuery } from '@apollo/client';
import {
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Loader,
  Text,
  Title,
} from '@mantine/core';
import { IoIosAirplane } from 'react-icons/io';


// TODO: Borrar
const ACTIVITIES_EXAMPLE_QUERY = gql`
{
  activites {
    activiteName
  } 
}
`

export default function travels() {
  const { data, loading, error } = useQuery(ACTIVITIES_EXAMPLE_QUERY)

  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb="md">Activities!</Title>
      {loading ? (
        <Loader />
      ) : error ? (
        <Text>Error loading activities: {error.message}</Text>
      ) : (
        <Grid>
          {data?.activites.map((activity, index) => (
            <Grid.Col span={4} key={index}>
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Text>{activity.activiteName}</Text>
                <Button variant="light" color="green" fullWidth mt="md" radius="md">
                  View Details
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}