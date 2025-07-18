import { NextRequest } from 'next/server';

import { searchWalletAssets } from '@/lib/solana/helius';
import { transformToPortfolio } from '@/types/helius/portfolio';

export async function GET(req: any, context: any) {
  const address = context?.params?.address;
  if (!address) {
    return new Response(JSON.stringify({ error: 'Missing address' }), { status: 400 });
  }
  try {
    const { fungibleTokens, nonFungibleTokens } =
      await searchWalletAssets(address);
    const portfolio = transformToPortfolio(
      address,
      fungibleTokens,
      nonFungibleTokens,
    );

    return Response.json(portfolio);
  } catch (error) {
    console.error('Error fetching wallet portfolio:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch wallet portfolio' }),
      {
        status: 500,
      },
    );
  }
}
