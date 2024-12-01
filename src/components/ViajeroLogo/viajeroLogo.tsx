import { Box, Group, Image, Text, Anchor  } from "@mantine/core";
import React, { useState } from "react";

export const ViajeroLogo = ({ height = 50, width = 50 }: { height?: number, width?: number }) => {
  const [scale, setScale] = useState(1);

  return (
  //TODO Is it okey to put a group here even thought we have another one in AppContainer? 
  <Group align="left">
    <Anchor href="/travels" 
      style={{ 
        textDecoration: "none", 
        display: "flex", 
        color: "inherit",  
        alignItems: "center",
        transition: "transform 0.3s ease",
        transform: `scale(${scale})`,
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
      }}
      onMouseEnter={() => setScale(1.1)}
      onMouseLeave={() => setScale(1)}
    >
      <Image src="/logo_viajero.png" h={height} w={width} alt="Viajero Logo" 
        style={{ 
          marginRight: "8px", 
          }} />
      <Text
        style={{
          fontFamily: "Poppins, sans-serif",
          letterSpacing: "1.2px",
          fontSize: "2rem",
          fontWeight: 700,
          textFillColor: "transparent",
        }}
      >Viajeros </Text>
    </Anchor>
  </Group>
);
};