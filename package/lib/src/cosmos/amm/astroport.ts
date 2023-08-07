import { xyk_swap } from "@astroport/math";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { LibError } from "../../error";

type AssetInfo = CW20AssetInfo | NativeAssetInfo;
type CW20AssetInfo = { token: { contract_addr: string } };
type NativeAssetInfo = { native_token: { denom: string } };

type Asset = {
  info: AssetInfo;
  amount: string;
};

export type PoolInfo = {
  assets: Asset[];
  total_share: string;
};

export type SwapResult = {
  return_amount: string;
  spread_amount: string;
  commission_amount: string;
};

const XYK_FEE = "0.003";

export async function getPoolInfo(client: CosmWasmClient, pool: string) {
  const pool_info: PoolInfo = await client.queryContractSmart(pool, {
    pool: {},
  });

  return pool_info;
}

export function xykSwap(amountIn: string, denomIn: string, poolInfo: PoolInfo) {
  const assetInIndex = poolInfo.assets.findIndex((a) => {
    if ("native_token" in a.info) {
      return a.info.native_token.denom.toLowerCase() === denomIn.toLowerCase();
    } else if ("token" in a.info) {
      return a.info.token.contract_addr.toLowerCase() === denomIn.toLowerCase();
    }

    return false;
  });
  const assetOutIndex = 1 - assetInIndex;
  const assetInInfo = poolInfo.assets[assetInIndex];

  if (!assetInInfo) {
    throw new LibError(`asset ${denomIn} not found`);
  }

  const asset_amounts = poolInfo.assets.map((asset) => asset.amount);

  const xyk_result: SwapResult = JSON.parse(
    xyk_swap(
      amountIn,
      String(assetOutIndex),
      JSON.stringify(asset_amounts),
      XYK_FEE,
    ),
  );

  return xyk_result;
}
