import { NextRequest, NextResponse } from 'next/server';

import { verifyUser } from '@/server/actions/user';
import {
  dbGetConversation,
  dbGetConversationMessages,
} from '@/server/db/queries';

/**
 * @param {import('next/server').NextRequest} req
 * @param {{ params: { conversationId: string } }} context
 */
export async function GET(
  req: any,
  context: any
) {
  const session = await verifyUser();
  const userId = session?.data?.data?.id;
  const publicKey = session?.data?.data?.publicKey;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!publicKey) {
    console.error('[chat/route] No public key found');
    return NextResponse.json({ error: 'No public key found' }, { status: 400 });
  }

  const conversationId = context?.params?.conversationId;
  if (!conversationId) {
    return new Response(JSON.stringify({ error: 'Missing conversationId' }), { status: 400 });
  }

  if (!conversationId) {
    return NextResponse.json(
      { error: 'Missing conversationId' },
      { status: 401 },
    );
  }

  try {
    const messages = await dbGetConversationMessages({
      conversationId,
      isServer: true,
    });

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Conversation messages not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error(
      `[chat/[conversationId]/route] Error fetching conversation: ${error}`,
    );
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
