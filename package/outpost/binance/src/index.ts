import { Price } from "@topmonks/valvebot-protobuf/generated/ts/price";
import { Request } from "zeromq";

async function runClient() {
  console.log("Connecting to hello world server…");

  //  Socket to talk to server
  const sock = new Request();
  sock.connect("tcp://localhost:5555");

  for (let i = 0; i < 10; i++) {
    console.log("Sending Hello ", i);
    await sock.send("Hello");
    const [result] = await sock.receive();
    const p = Price.decode(result);
    console.log("Received ", p);
  }
}

runClient();
