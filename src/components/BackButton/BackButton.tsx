import { VIAJERO_GREEN } from "../../consts/consts"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Button } from "@mantine/core"
import Router from "next/router";
import React from "react";

export const BackButton = ({ to }: { to?: string }) => {
  return (
    <ActionIcon variant="filled" color={VIAJERO_GREEN} onClick={() => {
      if (to) {
        Router.push(to)
        return
      }
      Router.back()
    }} px="md">
      <FontAwesomeIcon icon={faChevronLeft} color="white" />
    </ActionIcon>
  )
}