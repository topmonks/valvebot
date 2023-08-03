import { Router } from "zeromq";
import {
  OutpostMessage,
  OutpostMessageType,
  PriceMessage,
} from "@topmonks/valvebot-protobuf";
import { getEnvValue } from "@topmonks/valvebot-lib";

const senders: { [key: string]: Buffer } = {};

let _socket: Router;
async function getSocket() {
  if (_socket) {
    return _socket;
  }

  const socket = new Router();
  _socket = socket;

  await socket.bind(getEnvValue("SOCKET_ADDR"));

  return socket;
}

async function start() {
  const socket = await getSocket();

  for await (const [sender, _blank, header, ..._rest] of socket) {
    const message = OutpostMessage.decode(header);
    switch (message.type) {
      case OutpostMessageType.OUTPOST_MESSAGE_TYPE_CONNECT: {
        console.log("CONNECT", new Date().toISOString());

        console.log(PriceMessage.decode(message.body));

        break;
      }
      default: {
        console.log("UNKNOWN");
      }
    }
    // console.log(sender.toString(), header.toString());
    senders[header.toString()] = sender;
  }
}

start();
