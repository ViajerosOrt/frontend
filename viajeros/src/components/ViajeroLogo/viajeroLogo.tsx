import { Image } from "@mantine/core";

export const ViajeroLogo = ({ height = 50, width = 50 }: { height?: number, width?: number }) => (
  <Image src="/logo_viajero.png" h={height} w={width} />
)