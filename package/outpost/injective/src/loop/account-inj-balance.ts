import {
  OutpostMessageType,
  OutpostMessage,
  BalanceMessage,
} from "@topmonks/valvebot-protobuf";
import { getEnvValue, outpost } from "@topmonks/valvebot-lib";
import { getBalance } from "../balance";

export default async function injBalance() {
  const date = new Date();
  const denom = "inj";
  const amount = await getBalance(denom);

  const injBalanceMessage = OutpostMessage.fromPartial({
    type: OutpostMessageType.OUTPOST_MESSAGE_TYPE_BALANCE,
    body: BalanceMessage.encode(
      BalanceMessage.fromPartial({
        amount: amount,
        denom: denom,
        date: date.toISOString(),
      }),
    ).finish(),
  });

  const socket = outpost.getSocket(getEnvValue("HUB_SOCKET_ADDR"));
  await socket.send([null, OutpostMessage.encode(injBalanceMessage).finish()]);
}
