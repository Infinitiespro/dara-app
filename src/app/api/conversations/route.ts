// Defensive: move all imports and logic inside the handler to prevent build-time errors
export async function GET(req: any) {
  // Import only when handler is called
  const { NextResponse } = await import('next/server');
  const { verifyUser } = await import('@/server/actions/user');
  const { dbGetConversations } = await import('@/server/db/queries');

  try {
    const session = await verifyUser();
    const userId = session?.data?.data?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await dbGetConversations({ userId });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
