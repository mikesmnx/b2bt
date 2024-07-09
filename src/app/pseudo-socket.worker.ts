/// <reference lib="webworker" />

import { TableItemFactory } from "./classes/table-item-factory";
import { SocketAction } from "./models/socket-action";
import { SocketActionType } from "./models/socket-action-types";

let timerId: any = null;
let currentArraySize: number | null = null;
let currentTimer: number | null = null;

addEventListener('message', ({ data }: { data : SocketAction }) => {
  const { command, socketSettings } = data;

  if (command === SocketActionType.Start && socketSettings !== undefined) {
    const { arraySize, timer } = socketSettings;

    if (timerId === null || arraySize !== currentArraySize || timer !== currentTimer) {
      if (timerId !== null) {
        clearInterval(timerId);
      }

      currentArraySize = arraySize;
      currentTimer = timer;

      postMessage(TableItemFactory.createTableItems(arraySize));

      timerId = setInterval(() => {
        postMessage(TableItemFactory.createTableItems(arraySize));
      }, timer);
    }
  } else if (command === SocketActionType.Stop) {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }
});
