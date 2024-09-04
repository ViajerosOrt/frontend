import {
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Text,
  Title,
} from '@mantine/core';
import { IoIosAirplane } from 'react-icons/io';

export default function viajes() {
  return (
    <Container size="xl" mt="xl">
      <Title order={2} mb="md">Viajes!</Title>
      <Grid>
        {['La pedrera', 'Buenos Aires', 'Piriapolis'].map((city) => (
          <Grid.Col span={4} key={city}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={`/placeholder.svg?height=160&width=300`}
                  height={160}
                  alt={city}
                />
              </Card.Section>
              <Group mt="md" mb="xs">
                <Text>{city}</Text>
                <Button variant="light" color="blue" radius="md" leftSection={<IoIosAirplane />}>
                  Reservar
                </Button>
              </Group>
              <Text size="sm">
                Descubre la magia de {city} en tu próximo viaje.
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}