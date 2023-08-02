import { Price } from "@topmonks/valvebot-protobuf/generated/ts/price";
import { Subscriber } from "zeromq";

const p = Price.create({ price: "1" });

async function run() {
  const sock = new Subscriber();

  await sock.bind("tcp://127.0.0.1:3000");
  sock.subscribe("kitty cats");
  console.log("Subscriber connected to port 3000");

  for await (const [topic, msg] of sock) {
    console.log(
      "received a message related to:",
      topic,
      "containing message:",
      msg,
    );
  }
}

run();
