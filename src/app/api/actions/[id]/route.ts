// Defensive: move all imports and logic inside the handlers to prevent build-time errors
export async function DELETE(req: any, context: any) {
  const id = context?.params?.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }
  // Import only when handler is called
  const { NextResponse } = await import('next/server');
  const { verifyUser } = await import('@/server/actions/user');
  const { dbDeleteAction } = await import('@/server/db/queries');
  try {
    const session = await verifyUser();
    const userId = session?.data?.data?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await dbDeleteAction({ id, userId });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to delete action' },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting action:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: any, context: any) {
  const id = context?.params?.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  }
  // Import only when handler is called
  const { NextResponse } = await import('next/server');
  const { verifyUser } = await import('@/server/actions/user');
  const { dbUpdateAction } = await import('@/server/db/queries');
  try {
    const session = await verifyUser();
    const userId = session?.data?.data?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const result = await dbUpdateAction({ id, userId, data });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update action' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 },
    );
  }
}
