import { ANIMATIONS } from "@/consts/consts";
import { Box } from "@mantine/core";
import React from "react";
import { FaPlane } from "react-icons/fa";

const PlaneAnimation = () => {
   
  return (
    <Box
      style={{
        position: "absolute",
        top: "20px",
        left: "0px",
        animation: ANIMATIONS.fly,
      }}
    >
    <FaPlane size={35} color="gray" /> {}
    </Box>
  );
};

export default PlaneAnimation;