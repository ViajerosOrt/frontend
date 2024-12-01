import { Center, Group, Title } from "@mantine/core"
import React from "react"
import { IoMdEye } from "react-icons/io"

export const ViajeroEmptyMessage = ({ message }: { message: string }) => {
  return (
    <Center h="100vh">
      <Group>
        <IoMdEye />
        <Title order={4}>{message}</Title>
      </Group>
    </Center>
  )
}