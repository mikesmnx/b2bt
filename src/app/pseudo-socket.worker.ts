/// <reference lib="webworker" />

import { TableItemFactory } from "./classes/table-item-factory";
import { SocketAction } from "./models/socket-action";
import { SocketActionType } from "./models/socket-action-types";

let timerId: any = null;

addEventListener('message', ({ data }: { data : SocketAction }) => {
  const { command, socketSettings } = data;

  if (command === SocketActionType.Start && socketSettings !== undefined) {
    if (timerId === null) {
      timerId = setInterval(() => {
        postMessage(TableItemFactory.createTableItems(10));
      }, socketSettings.timer);
    }
  } else if (command === SocketActionType.Stop) {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
      postMessage('Worker has stopped');
    }
  }
});
