import { getEnvValue } from "@topmonks/valvebot-lib";

export const pair = getEnvValue<string>("OUTPOST_BINANCE_PAIR");
export const id = "BINANCE" + "_" + pair;
