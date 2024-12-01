import { VIAJERO_GREEN } from "../../consts/consts"
import { Center, Loader } from "@mantine/core"
import React from "react"

export const ViajeroLoader = () => {
  return (
    <Center h="100vh">
      <Loader color={VIAJERO_GREEN} />
    </Center>
  )
}