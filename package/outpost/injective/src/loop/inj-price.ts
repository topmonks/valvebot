import {
  OutpostMessageType,
  PriceMessage,
  OutpostMessage,
} from "@topmonks/valvebot-protobuf";
import { getEnvValue, outpost } from "@topmonks/valvebot-lib";
import { getPrice } from "../dex";

export default async function injPrice() {
  const amountIn = (1e18).toString();
  const denom = "inj";
  const date = new Date().toISOString();

  const amountOut = await getPrice(amountIn, denom);

  const priceMessage = OutpostMessage.fromPartial({
    type: OutpostMessageType.OUTPOST_MESSAGE_TYPE_PRICE,
    body: PriceMessage.encode(
      PriceMessage.fromPartial({
        price: amountOut,
        date: date,
      }),
    ).finish(),
  });

  const socket = outpost.getSocket(getEnvValue("HUB_SOCKET_ADDR"));
  await socket.send([null, OutpostMessage.encode(priceMessage).finish()]);
}
