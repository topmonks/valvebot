import {
  OutpostMessageType,
  PriceMessage,
  OutpostMessage,
} from "@topmonks/valvebot-protobuf";
import { getEnvValue, outpost } from "@topmonks/valvebot-lib";

const m = OutpostMessage.fromPartial({
  type: OutpostMessageType.OUTPOST_MESSAGE_TYPE_CONNECT,
  body: PriceMessage.encode(
    PriceMessage.fromPartial({
      price: "1",
      date: new Date().toISOString(),
    }),
  ).finish(),
});

setInterval(async () => {
  try {
    const socket = outpost.getSocket(getEnvValue("SOCKET_ADDR"));
    await socket.send([null, OutpostMessage.encode(m).finish()]);
  } catch (e) {
    console.error(e);
  }
}, 2000);

async function connect() {
  const socket = outpost.getSocket(getEnvValue("SOCKET_ADDR"));
  await socket.send([null, OutpostMessage.encode(m).finish()]);

  for await (const [_blank, header, ..._rest] of socket) {
    console.log(header.toString());
  }
}

connect();
