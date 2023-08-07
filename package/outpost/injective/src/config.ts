import { getEnvValue } from "@topmonks/valvebot-lib";

export type DEX_TYPE = "ASTROPORT";

export const dex = getEnvValue<DEX_TYPE>("OUTPOST_INJECTIVE_DEX");
export const pair = getEnvValue<string>("OUTPOST_INJECTIVE_PAIR");
export const id = dex + "_" + pair;
