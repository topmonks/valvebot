import { HubMessage } from "@topmonks/valvebot-protobuf";
import { Dealer } from "zeromq";

let _socket: Dealer;
export function getSocket(url: string) {
  if (_socket) {
    return _socket;
  }

  const socket = new Dealer({
    reconnectInterval: 1000,
  });
  _socket = socket;

  socket.connect(url);

  return socket;
}

export function processHubMessage(hubMessage: HubMessage) {
  // switch(hubMessage)
}
