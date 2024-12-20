export const getEthPrice = async (): Promise<number | null> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 60 } }, // This ensures data is revalidated after 60 seconds (optional)
    );
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error("Failed to fetch ETH price:", error);
    return null;
  }
};
