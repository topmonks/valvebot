import { cosmos } from "@topmonks/valvebot-lib";
import { chainId, injectiveAddress } from "./config";

export async function getBalance(denom: string) {
  return cosmos.withClient<Promise<string>>(async (client) => {
    const balance = await client.getBalance(injectiveAddress, denom);

    return balance.amount;
  }, chainId);
}
