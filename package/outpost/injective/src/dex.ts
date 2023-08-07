import { cosmos, getEnvValue } from "@topmonks/valvebot-lib";
import { OutpostInjectiveError } from "./error";
import { dex } from "./config";

export async function getAstroportPool() {
  return cosmos.withClient<Promise<cosmos.astroport.PoolInfo>>(
    async (client) => {
      const poolAddr = getEnvValue<string>(
        "OUTPOST_INJECTIVE_ASTROPORT_INJUSDT_ADDR",
      );
      const poolInfo = await cosmos.astroport.getPoolInfo(client, poolAddr);

      return poolInfo;
    },
    getEnvValue("OUTPOST_INJECTIVE_CHAIN_ID"),
  );
}

export async function getPrice(amount: string, denomIn: string) {
  switch (dex) {
    case "ASTROPORT": {
      const poolInfo = await getAstroportPool();

      return cosmos.astroport.xykSwap(amount, denomIn, poolInfo).return_amount;
    }
    default: {
      throw new OutpostInjectiveError(`unknown dex type ${dex}`);
    }
  }
}
