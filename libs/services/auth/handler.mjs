import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const COGNITO_POOL_URL = "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_x7Uj50IG9";
const client = jwksClient({
  jwksUri: `${COGNITO_POOL_URL}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export const handler = async (event) => {
  if (!event.headers.Authorization) {
    throw new Error("No accessToken");
  }

  const token = event.headers.Authorization;
  const options = {
    issuer: COGNITO_POOL_URL,
    algorithms: ["RS256"],
  };

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (err, decodedToken) => {
        if (err) {
          reject(err);
        } else {
          resolve(decodedToken);
        }
      });
    });

    const userId = decoded.sub;
    return generatePolicy(userId, "Allow", event.methodArn, { userId });
  } catch (err) {
    console.error("JWT verification error:", err);
    throw new Error("Invalid accessToken");
  }
};

const generatePolicy = (principalId, effect, resource, context) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };
};
