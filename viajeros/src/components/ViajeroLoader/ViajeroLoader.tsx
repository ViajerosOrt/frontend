import { VIAJERO_GREEN } from "@/consts"
import { Center, Loader } from "@mantine/core"

export const ViajeroLoader = () => {
  return (
    <Center h="100vh">
      <Loader color={VIAJERO_GREEN} />
    </Center>
  )
}