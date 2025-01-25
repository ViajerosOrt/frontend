// components/DualPageLayout.tsx

import { useIsMobile } from "@/hooks/useIsMobile";
import { Grid, ScrollArea, Box } from "@mantine/core";

interface DualPageLayoutProps {
  mobileToggle?: boolean;
  // Left column content
  leftColumn: React.ReactNode;
  // Right column content 
  rightColumn: React.ReactNode;
}

export function DualPageLayout({
  mobileToggle,
  leftColumn,
  rightColumn,
}: DualPageLayoutProps) {
  const { isMobile } = useIsMobile();

  return (
    <Box w="100%" h="100%">
      <Grid overflow="hidden" gutter="0px">
        <Grid.Col
          span={{ base: 12, md: 5 }}
          hidden={isMobile && !!mobileToggle}
        >
          <ScrollArea.Autosize h="100%" w="100%">
            {leftColumn}
          </ScrollArea.Autosize>
        </Grid.Col>

        {(!isMobile || mobileToggle) && (
          <Grid.Col
            span={{ base: 12, md: 7 }}
            h="100%"
            className={`transition-height ${!isMobile ? "border-l" : ""}`}
          >
            {rightColumn}
          </Grid.Col>
        )}
      </Grid>
    </Box>
  );
}
