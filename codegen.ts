import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as configuration } from "dotenv";
import { resolve } from "path";

configuration({ path: resolve(__dirname, ".env.local") });

const backendApi = process.env.NEXT_PUBLIC_GRAPHQL_API_URL ?? 'http://localhost:4000/graphql'

console.log("Backend API: ", backendApi)
// TODO: Change schema when deploying the app with a diferent endpoint.
const config: CodegenConfig = {
  schema: backendApi,
  documents: ["./src/graphql/**/*.ts"],
  generates: {
    "./src/graphql/__generated__/gql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        preset: "client",
        withHooks: true,
        withMutationFn: true,
        inlineFragmentTypes: "inline",
        scalars: {
          NaiveDateTime: "string",
        },
      },
    },
  },
};
export default config;
