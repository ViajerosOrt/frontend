import { ColorSchemeScript } from "@mantine/core";
import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link
      //FS: Where should we import fonts styles?
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
            rel="stylesheet"
          />
      </Head>
      <ColorSchemeScript defaultColorScheme="auto" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
