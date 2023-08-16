import axios from "axios";

const url = "https://prisma.auth.eu-north-1.amazoncognito.com";
const clientId = "5o7brqfj045hijqtko2vhnvfmi";
const clientSecret = process.env.AWS_COGNITO_SECRET;
const redirectUri = encodeURIComponent("http://localhost:3000/api/auth/callback");

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  console.log("CALLED");
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code not found");
  }

  const tokenUrl = `${url}/oauth2/token`;
  const authString = `${clientId}:${clientSecret}`;
  const headers = {
    Authorization: "Basic " + Buffer.from(authString).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: decodeURIComponent(redirectUri),
    code,
  });

  try {
    const response = await axios.post(tokenUrl, body, { headers });
    const { access_token, id_token, refresh_token } = response.data;

    res.setHeader("Set-Cookie", [
      `idToken=${id_token}; path=/; HttpOnly; Secure; SameSite=Lax`,
      `accessToken=${access_token}; path=/; HttpOnly; Secure; SameSite=Lax`,
      `refreshToken=${refresh_token}; path=/; HttpOnly; Secure; SameSite=Lax`,
    ]);

    // Redirect to the root.
    res.writeHead(302, { Location: "/" });
    res.end();
  } catch (error) {
    console.error("Error fetching tokens:", error);
    res.status(500).send("Failed to fetch tokens");
  }
}
