const EventEmitter = require('events')
const WebSocket = require('ws')

class Socket extends EventEmitter {
    constructor(IP, PORT, END) {
        super();
        this._IP = IP;
        this._PORT = PORT;
        this._END = END;
        this.ws = null;
        this._connect();

    }

    _connect() {
        console.log("connecting: ", this._END);
        this.ws = new WebSocket(`ws://${this._IP}:${this._PORT}/${this._END}`);

        this.ws.on('error', (data) => {
            console.log("ERR: ", data)
        });

        this.ws.on('open', () => {
            this.emit('connected');
            console.log("connected: ", this._END);
            if(this._END === 'state') {
                this.ws.send(JSON.stringify(["mode", "color", "page", "brightness", "pages", "volume"]))
            }
        });

        this.ws.on('close', () => {
            console.log("disconnected");
            this.connectedState = false;
            this.emit("disconnected");
            setTimeout(() => {
                this._reconnect()
            }, 5000);
        });

        this.ws.on('message', (data) => {

            data = JSON.parse(data);
            console.log("data received", data);
            this.emit('data', data);
            // this.data = {...this.data, ...data}
            //
            // if(data.page != null) {
            //     this.currentPage = this.data.pages[data.page]
            //     console.log(this.currentPage)
            // }
            //
            // if(data.pages) {
            //     this.pageCount = data.pages.length -1
            // }
            //
            // if(!this.connectedState) {
            //     this.connected(true)
            //     this.emit('connected')
            // }
        })
    }

    _reconnect() {
        this._connect();
    }

    send(data) {
        console.log("sending to ", this._END, data);
        this.ws.send(data);
    }
}

module.exports = Socket;