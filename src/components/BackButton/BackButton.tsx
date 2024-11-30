import { VIAJERO_GREEN } from "@/consts"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Button } from "@mantine/core"
import Router from "next/router";

export const BackButton = () => {
  return (
    <ActionIcon variant="filled" color={VIAJERO_GREEN} onClick={Router.back} px="md">
      <FontAwesomeIcon icon={faChevronLeft} color="white" />
    </ActionIcon>
  )
}