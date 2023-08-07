import {
  OutpostMessageType,
  PriceMessage,
  OutpostMessage,
  ConnectMessage,
} from "@topmonks/valvebot-protobuf";
import { getEnvValue, outpost } from "@topmonks/valvebot-lib";
import { id } from "./config";
import { getPrice } from "./dex";

async function checkPrice() {
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

  const socket = outpost.getSocket(getEnvValue("SOCKET_ADDR"));
  await socket.send([null, OutpostMessage.encode(priceMessage).finish()]);
}

function repeatCheckPrice() {
  checkPrice()
    .catch((e) => console.error(e))
    .finally(repeatCheckPrice);
}

repeatCheckPrice();

async function connect() {
  const socket = outpost.getSocket(getEnvValue("SOCKET_ADDR"));
  const connectMessage = OutpostMessage.fromPartial({
    type: OutpostMessageType.OUTPOST_MESSAGE_TYPE_CONNECT,
    body: ConnectMessage.encode(
      ConnectMessage.fromPartial({
        id: id,
        timeoutInMs: parseInt(getEnvValue<string>("OUTPOST_INJECTIVE_TIMEOUT")),
      }),
    ).finish(),
  });

  await socket.send([null, OutpostMessage.encode(connectMessage).finish()]);

  for await (const [_blank, header, ..._rest] of socket) {
    console.log(header.toString());
  }
}

connect();
