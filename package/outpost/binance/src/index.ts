import {
  OutpostMessageType,
  OutpostMessage,
  ConnectMessage,
} from "@topmonks/valvebot-protobuf";
import { getEnvValue, outpost } from "@topmonks/valvebot-lib";
import { id } from "./config";

async function connect() {
  const socket = outpost.getSocket(getEnvValue("HUB_SOCKET_ADDR"));
  const connectMessage = OutpostMessage.fromPartial({
    type: OutpostMessageType.OUTPOST_MESSAGE_TYPE_CONNECT,
    body: ConnectMessage.encode(
      ConnectMessage.fromPartial({
        id: id,
        timeoutInMs: parseInt(getEnvValue<string>("OUTPOST_BINANCE_TIMEOUT")),
      }),
    ).finish(),
  });
  await socket.send([null, OutpostMessage.encode(connectMessage).finish()]);

  for await (const [_blank, header, ..._rest] of socket) {
    console.log(header.toString());
  }
}

connect();
