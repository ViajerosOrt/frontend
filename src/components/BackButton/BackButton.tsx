import { VIAJERO_GREEN } from "@/consts"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mantine/core"
import Router from "next/router";

export const BackButton = () => {
  return (
    <Button
      variant="filled"
      color={VIAJERO_GREEN}
      onClick={Router.back}
      px="sm"
      w="fit-content"
      radius="md"
      leftSection={<FontAwesomeIcon icon={faChevronLeft} color="black" />}
    />
  )
}