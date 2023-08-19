import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-provider-env";

const client = new CognitoIdentityProviderClient({
  region: "eu-north-1",
  credentials: fromEnv(),
});

export default client;
