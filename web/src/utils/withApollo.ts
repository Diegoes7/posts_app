import { withApollo as createWithApollo } from "next-apollo";
import { client } from "./apollo_client";

if(!client) {
  throw new Error("Apollo client is not initialized. Ensure that the client is properly configured.");
}

export const withApollo = createWithApollo(client);