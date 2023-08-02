import { Router } from "zeromq";

const senders: { [key: string]: Buffer } = {};

let _socket: Router;
async function getSocket() {
  if (_socket) {
    return _socket;
  }

  const socket = new Router();
  _socket = socket;

  await socket.bind("tcp://*:5555");

  return socket;
}

setInterval(async () => {
  const socket = await getSocket();
  const sender = senders["my id"];

  if (sender) {
    await socket.send([sender, null, "response"]);
  }
}, 1000);

async function run() {
  const socket = await getSocket();

  for await (const [sender, blank, header, ...rest] of socket) {
    console.log(sender.toString(), header.toString());
    senders[header.toString()] = sender;
  }
}

run();
