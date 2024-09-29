import { gql, useApolloClient, useQuery } from "@apollo/client";
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
} from "@mantine/core";
import { IoIosAirplane } from "react-icons/io";


export default function travels() {

  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb="md">
        Activities!
      </Title>
      <Grid>
        {/*TODO: SHOW TRAVELS */}
      </Grid>
    </Container>
  );
}
