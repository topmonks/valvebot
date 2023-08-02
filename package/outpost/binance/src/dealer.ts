import { Dealer } from "zeromq";

async function run() {
  const socket = new Dealer({});

  socket.connect("tcp://127.0.0.1:5555");

  await socket.send([null, "my id"]);

  for await (const [blank, header, ...rest] of socket) {
    console.log(header.toString());
  }
}

run();
