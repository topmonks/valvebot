import {
  OutpostMessageType,
  OutpostMessage,
  ConnectMessage,
} from "@topmonks/valvebot-protobuf";
import { getEnvValue, outpost } from "@topmonks/valvebot-lib";
import { id } from "./config";
import injPrice from "./loop/inj-price";
import injBalance from "./loop/account-inj-balance";
import { nextTick } from "process";
import { setTimeout } from "timers/promises";

function repeatCheckInjBalance() {
  Promise.all([injBalance(), setTimeout(1000)])
    .catch((e) => console.error(e))
    .finally(() => nextTick(repeatCheckInjBalance));
}

repeatCheckInjBalance();

function repeatCheckPrice() {
  Promise.all([injPrice(), setTimeout(0)])
    .catch((e) => console.error(e))
    .finally(() => nextTick(repeatCheckPrice));
}

repeatCheckPrice();

async function connect() {
  const socket = outpost.getSocket(getEnvValue("HUB_SOCKET_ADDR"));
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
