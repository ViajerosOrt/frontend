import { VIAJERO_GREEN } from "@/consts"
import { Card, Center, Group, Stack, Title } from "@mantine/core"
import React from "react"
import { IoMdEye } from "react-icons/io"

export const ViajeroEmptyMessage = ({ message }: { message: string }) => {
  return (
    <Center h="100vh">
      <Card
        radius="md"
        padding="lg"
        withBorder
        style={{
          borderColor: VIAJERO_GREEN,
          borderWidth: '2px',
        }}
      >
        <Stack align="center">
          <IoMdEye className="h-10 w-10" />
          <Title order={4}>{message}</Title>
        </Stack>
      </Card>
    </Center>
  )
}