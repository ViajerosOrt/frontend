import type { CodegenConfig } from "@graphql-codegen/cli";

// TODO: Change schema when deploying the app with a diferent endpoint.
const config: CodegenConfig = {
  schema: "AppViajeros-env.eba-demjbuvb.us-east-1.elasticbeanstalk.com",
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
