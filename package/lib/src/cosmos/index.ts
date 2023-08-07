import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { chains } from "chain-registry";
import { LibError } from "../error";

export * as astroport from "./amm/astroport";

export function findChain(chainId: string): (typeof chains)[0] {
  const chain = chains.find((c) => c.chain_id === chainId);

  if (!chain) {
    throw new LibError(`ChainId ${chainId} not found`);
  }

  return chain;
}

let currentCachedClient: {
  [key: string]: Awaited<ReturnType<typeof getQueryClient>>;
} = {};

export async function withClient<T>(
  fn: (client: CosmWasmClient) => T,
  chainId: string,
  max_attempts = 1,
) {
  let client = currentCachedClient[chainId] || (await getQueryClient(chainId));

  currentCachedClient[chainId] = client;

  let error: unknown;

  for (let attempt = 0; attempt < max_attempts; attempt++) {
    try {
      return await fn(client.client);
    } catch (e) {
      error = e;
      client = await getNextQueryClient({
        endpoint: client.endpoint,
        rpcs: client.rpcs,
      });

      currentCachedClient[chainId] = client;
    }
  }

  throw error;
}

export async function getQueryClient(chainId: string): Promise<{
  client: CosmWasmClient;
  endpoint: string;
  rpcs: string[];
}> {
  const chain = findChain(chainId);
  const rpcs = chain.apis?.rpc?.map((r) => r.address) || [];

  const rpc = rpcs[0];

  if (!rpc) {
    throw new LibError(`No rpc endpoint found for chainId ${chainId}`);
  }

  try {
    const client = await CosmWasmClient.connect(rpc);
    return {
      client,
      endpoint: rpc,
      rpcs,
    };
  } catch {
    return await getNextQueryClient({
      endpoint: rpc,
      rpcs,
    });
  }
}

export async function getNextQueryClient(
  opts: Omit<Awaited<ReturnType<typeof getQueryClient>>, "client">,
  retries = 0,
): ReturnType<typeof getQueryClient> {
  const { rpcs, endpoint } = opts;

  const currentIndex = rpcs.findIndex((r) => r === endpoint);
  const nextIndex = (currentIndex + 1) % rpcs.length;

  const rpc = rpcs[nextIndex];
  try {
    const client = await CosmWasmClient.connect(rpc);

    return {
      client,
      endpoint: rpc,
      rpcs,
    };
  } catch (e) {
    if (retries > rpcs.length) {
      throw new LibError(
        `cosmwasm client connect error retries > ${rpcs.length}`,
      );
    } else {
      return await getNextQueryClient(
        {
          endpoint: rpc,
          rpcs,
        },
        retries + 1,
      );
    }
  }
}
