
import TravelCreateModal from '../../components/Travels/TravelCreateForm';
import { Button, Container, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ApolloError, useMutation } from '@apollo/client';
import { CREATE_TRAVEL_MUTATION } from '@/graphql/travels/travel.mutations';

const TravelCreate = () => {
  return (
    <Container size="md" mt="xl">
      <Title  mb="lg">
        Create a Travel
      </Title>
      <TravelCreateModal />
    </Container>
  );
};

export default TravelCreate;
