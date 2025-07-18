import { cache } from 'react';

import { z } from 'zod';

export interface JupiterToken {
  address: string;
  name: string;
  logoURI: string | null;
  symbol: string;
}

const jupiterTokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  logoURI: z.string().nullable(),
});

const jupiterTokensSchema = z.array(jupiterTokenSchema);

// Cache the fetch for 5 minutes
export const getJupiterTokens = cache(async (): Promise<JupiterToken[]> => {
  try {
    const response = await fetch('https://tokens.jup.ag/tokens?tags=verified', {
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Jupiter tokens');
    }

    const data = await response.json();
    const parsed = jupiterTokensSchema.parse(data);

    // Only return the fields we need
    return parsed.map((token) => ({
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      logoURI: token.logoURI,
    }));
  } catch (error) {
    console.error('Error fetching Jupiter tokens:', error);
    return [];
  }
});

export const searchJupiterTokens = async (
  query: string,
): Promise<JupiterToken[]> => {
  const tokens = await getJupiterTokens();
  if (!query) return tokens;

  const searchTerm = query.toLowerCase();
  return tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm) ||
      token.symbol.toLowerCase().includes(searchTerm) ||
      token.address.toLowerCase() === searchTerm.toLowerCase(),
  );
};

export interface TokenPrice {
  id: string;
  type: string;
  price: string;
}

export interface TokenPriceResponse {
  data: {
    [key: string]: TokenPrice;
  };
  timeTaken: number;
}

// Cache the fetch for 5 seconds
export const getJupiterTokenPrice = cache(
  async (
    tokenAddress: string,
    showExtraInfo: boolean = true,
  ): Promise<TokenPrice | null> => {
    try {
      // Use Jupiter quote API to get price information
      // We'll get the price by quoting a swap from the token to USDC
      const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC mint address
      const amount = '1000000000'; // 1 SOL in lamports (for SOL) or equivalent for other tokens
      
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${tokenAddress}&outputMint=${usdcMint}&amount=${amount}&slippageBps=50`,
        {
          next: {
            revalidate: 5, // Cache for 5 seconds
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }

      const data = await response.json();
      
      // Calculate the price per token
      const inAmount = parseFloat(data.inAmount);
      const swapUsdValue = parseFloat(data.swapUsdValue);
      const pricePerToken = swapUsdValue / (inAmount / Math.pow(10, 9)); // Assuming 9 decimals for most tokens
      
      return {
        id: tokenAddress,
        type: 'price',
        price: pricePerToken.toString(),
      };
    } catch (error) {
      console.error('Error fetching Jupiter token price:', error);
      return null;
    }
  },
);
