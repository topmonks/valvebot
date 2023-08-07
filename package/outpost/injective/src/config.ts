import { PrivateKey } from "@injectivelabs/sdk-ts";
import { getEnvValue } from "@topmonks/valvebot-lib";

export type DEX_TYPE = "ASTROPORT";

export const chainId = getEnvValue<string>("OUTPOST_INJECTIVE_CHAIN_ID");
export const dex = getEnvValue<DEX_TYPE>("OUTPOST_INJECTIVE_DEX");
export const pair = getEnvValue<string>("OUTPOST_INJECTIVE_PAIR");
export const id = dex + "_" + pair;

export const mnemonic = getEnvValue<string>("OUTPOST_INJECTIVE_MNEMONIC");
export const privateKey = PrivateKey.fromMnemonic(mnemonic);
export const injectiveAddress = privateKey.toBech32();
