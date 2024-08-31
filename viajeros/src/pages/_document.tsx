import { ColorSchemeScript } from "@mantine/core";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <ColorSchemeScript defaultColorScheme="auto" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
