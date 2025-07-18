// Defensive: move all imports and logic inside the handler to prevent build-time errors
export async function POST(req: any) {
  // Import only when handler is called
  const fetch = (await import('node-fetch')).default;
  const { getUserData } = await import('@/server/actions/user');

  const DISCORD_API_BASE_URL = 'https://discordapp.com/api';
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  const GUILD_ID = process.env.DISCORD_GUILD_ID;
  const ROLE_ID = process.env.DISCORD_ROLE_ID;

  if (!BOT_TOKEN || !GUILD_ID || !ROLE_ID) {
    return new Response('Discord environment variables not set', { status: 500 });
  }

  const userData = await getUserData();
  const hasEarlyAccess = userData?.data?.data?.earlyAccess;

  if (!hasEarlyAccess) {
    return new Response('User does not have early access', { status: 403 });
  }

  const body = await req.json();
  const userId = body?.userId;

  if (!userId) {
    return new Response('User ID is required', { status: 400 });
  }

  try {
    const url = `${DISCORD_API_BASE_URL}/guilds/${GUILD_ID}/members/${userId}/roles/${ROLE_ID}`;

    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });
    return new Response('Role granted successfully', { status: 200 });
  } catch (error) {
    return new Response('Failed to grant role', { status: 500 });
  }
}
