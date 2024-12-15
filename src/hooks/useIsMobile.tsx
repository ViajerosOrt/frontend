import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export function useIsMobile() {
  const matches = useMediaQuery(`(max-width: ${em(750)})`);
  const isLoading = matches === undefined;

  return {
    isMobile: matches,
    isLoading
  };
}