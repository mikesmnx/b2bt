import { SocketActionType } from "./socket-action-types";
import { SocketSettings } from "./socket-settings";

export interface SocketAction {
    command: SocketActionType,
    socketSettings?: SocketSettings,
}