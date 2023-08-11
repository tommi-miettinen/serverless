const url = "https://prisma.auth.eu-north-1.amazoncognito.com";
const clientId = "5o7brqfj045hijqtko2vhnvfmi";
const redirectUri = encodeURIComponent("http://localhost:3000/api/auth/callback");

export default async (req: any, res: any) => {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code not found");
  }

  const params = {
    ClientId: clientId,
    GrantType: "authorization_code",
    Code: code,
    RedirectUri: decodeURIComponent(redirectUri),
  };

  console.log(params);

  // Redirect to the root.
  res.writeHead(302, { Location: "/" });
  res.end();
};
