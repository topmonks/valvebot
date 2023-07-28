import { Price } from "@topmonks/valvebot-protobuf/generated/ts/price";

const p = Price.create({ price: "1" });

import { Reply } from "zeromq";

async function runServer() {
  const sock = new Reply();

  await sock.bind("tcp://*:5555");

  for await (const [msg] of sock) {
    console.log("Received " + ": [" + msg.toString() + "]");
    await sock.send(Price.encode(p).finish());
    // Do some 'work'
  }
}

runServer();
