import { SocketSettings } from "./socket-settings";

export interface AppSettings extends SocketSettings { 
    additionalArrayIds: string;
}
