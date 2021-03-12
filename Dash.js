const WebSocket = require('ws')
const Socket = require('./Socket')
const EventEmitter = require('events')

class Dash extends EventEmitter {

    constructor(IP, PORT) {
        super()
        this._PORT = PORT;
        this._IP = IP;
        this.data = {
            mode: null,
            color: null,
            page: null,
            brightness: null,
            volume: null,
            pages: [],
        };
        this.currentPage = null;
        this.actionConnected = false;
        this.stateConnected = false;
        this.pageCount = 0;
        this.connected=false;
        this.sockets = {action: new Socket(this._IP, this._PORT, 'action'), state: new Socket(this._IP, this._PORT, 'state')};
        this.sockets.action.on('data', (data) => this.parseData(data));
        this.sockets.action.on('connected', () => this.actionConnected = true);
        this.sockets.action.on('disconnected', () => this.connected = false);
        this.sockets.state.on('data', (data) => {
            this.parseData(data);
            if(!this.connected) {
                this.connected = true;
                this.emit("connected");
            }
        });
        this.sockets.state.on('connected', () => this.stateConnected = true);
        this.sockets.state.on('disconnected', () => this.connected = false);
    }

    mode(mode) {
        if(mode) {
            this._setSocketData({mode}, 'state');
        } else {
            return this.data.mode;
        }
    }

    color(color) {
        if(color) {
            this._setSocketData({color}, 'state');
        } else {
            return this.data.color;
        }
    }

    cyclePage() {
        this._setSocketData(["cycle_page"], 'action');
    }

    page(page) {
        switch(typeof page) {
            case "number":
                if(this.data.pages[page].enabled) {
                    this._setSocketData({page: page}, 'state');
                } else {
                    console.log("ERR selected page not enabled");
                }
                break;

            case "string":
                for(let i=0;i<this.data.pages.length;i++) {
                    if(this.data.pages[i].name === page || this.data.pages[i].key === page) {
                        if(this.data.pages[i].enabled) {
                            this._setSocketData({page: i}, 'state');
                        } else {
                            console.log("ERR selected page not enabled");
                        }
                    }
                }
                break;

            default:
                return this.currentPage;
        }
    }

    brightness(brightness) {
        if(brightness) {
            this._setSocketData({brightness: brightness}, 'state');
        } else {
            return this.data.brightness;
        }
    }

    volume(volume) {
        if(volume) {
            this._setSocketData({volume: volume}, 'state');
        } else {
            return this.data.volume;
        }
    }

    parseData(data) {
        this.data = {...this.data, ...data};
        if(data.page != null) {
            this.currentPage = this.data.pages[data.page];
        }

        if(data.pages) {
            this.pageCount = data.pages.length -1;
        }
    }

    _setSocketData(data, type) {
        if(this.actionConnected && this.stateConnected) {
            if(type === 'state') {
                this.sockets.state.send(JSON.stringify(data));
            } else {
                this.sockets.action.send(JSON.stringify(data));
            }
        } else {
            console.log("message not sent, no connection");
        }

    }

    _getSocketData(data) {
        this.ws.send(JSON.stringify([data]));
    }

}

module.exports = Dash;
