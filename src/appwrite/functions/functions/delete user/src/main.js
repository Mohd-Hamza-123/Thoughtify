import { Client, Users, Account, Databases } from "node-appwrite";

const ALLOWED_ORIGINS = ["http://localhost:5173", process.env.VITE_THOUGHTIFY_DOMAIN];

const databaseId = process.env.VITE_APPWRITE_DATABASE_ID
const profileCollectionId = process.env.VITE_APPWRITE_PROFILECOLLECTION_ID

export default async ({ req, res, log }) => {

  const origin = req.headers.origin || "";
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  const CORS = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  // Preflight first (before reading body)
  if (req.method === "OPTIONS") return res.text("", 204, CORS);

  const { jwt } = JSON.parse(req.body ?? "{}");
  if (!jwt) return res.json({ error: "No JWT" }, 400, CORS);

  // 1) USER CLIENT — for account-scoped operations
  const userClient = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setJWT(jwt);

  let userId;
  try {
    const me = await new Account(userClient).get(); // OK with JWT
    userId = me.$id;
  } catch (e) {
    return res.json({ error: "Invalid or expired JWT" }, 401, CORS);
  }

  // 2) ADMIN CLIENT — for Users API (requires API key scopes)
  const adminClient = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // function secret


  const users = new Users(adminClient);
  const databases = new Databases(adminClient);

  try {
    const response = await users.list(); // requires 'users.read' on the key
    log(`Total users: ${response.total}`);
  } catch (err) {
    return res.json({ error: "Could not list users: " + err.message }, 500, CORS);
  }

  if (req.path === "/ping") {
    try {
      await users.delete(userId)
      await databases.deleteDocument(databaseId, profileCollectionId, userId)
      return res.json({
        success: true,
        message: `account is deleted`
      }, 200, CORS);
    } catch (error) {
      return res.json({ success: false, error: error?.message }, 500, CORS);
    }

  }

  return res.json(
    {
      motto: "Build like a team of hundreds_",
      learn: "https://appwrite.io/docs",
      connect: "https://appwrite.io/discord",
      getInspired: "https://builtwith.appwrite.io",
    },
    200,
    CORS
  );
};
