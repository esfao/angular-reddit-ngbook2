import * as io from "socket.io-client";
import Stream from "xstream";
import Socket = SocketIOClient.Socket;

export const makeSocketIODriver = () => (): SocketIOSource => {
    const serverURL = "https://io.lightstream.bitflyer.com";
    const options = { transports: ["websocket"] };
    return new SocketIOSource(io(serverURL, options));
};

export class SocketIOSource {
    public boardSnapshot$: Stream<object> = Stream.create();
    public board$: Stream<object> = Stream.create();
    public ticker$: Stream<object> = Stream.create();
    public execution$: Stream<object> = Stream.create();

    private channelNames = [
        