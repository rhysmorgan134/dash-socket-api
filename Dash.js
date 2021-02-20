const WebSocket = require('ws')
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
        }
        this.currentPage = null
        this.connectedState = false
        this.pageCount = 0
        this.ws = null
        this._connect()

    }

    connected(state) {
        state ? this.connectedState = true : this.connectedState = false
    }

    mode(mode) {
        if(mode) {
            console.log("changing mode to ", mode)
            this._setSocketData({mode})
        } else {
            return this.data.mode
        }
    }

    color(color) {
        if(color) {
            console.log("changing colour to ", color)
            this._setSocketData({color})
        } else {
            return this.data.color
        }
    }

    page(page) {
        console.log("looping for ", page)
        switch(typeof page) {
            case "number":
                console.log("int", page)
                if(this.data.pages[page].enabled) {
                    this._setSocketData({page: page})
                } else {
                    console.log("ERR selected page not enabled")
                }
                break

            case "string":
                console.log("string", page)
                for(let i=0;i<this.data.pages.length;i++) {
                    if(this.data.pages[i].name === page || this.data.pages[i].key === page) {
                        if(this.data.pages[i].enabled) {
                            console.log("changing page to: ", page)
                            this._setSocketData({page: i})
                        } else {
                            console.log("ERR selected page not enabled")
                        }
                    }
                }
                break

            default:
                console.log("getting page default")
                return this.currentPage
        }
    }

    brightness(brightness) {
        if(brightness) {
            console.log("changing brightness to ", brightness)
            this._setSocketData({brightness: brightness})
        } else {
            return this.data.brightness
        }
    }

    volume(volume) {
        if(volume) {
            console.log("changing mode to ", volume)
            this._setSocketData({volume: volume})
        } else {
            return this.data.volume
        }
    }

    _reconnect() {
        this._connect()
    }

    _connect() {
        this.ws = new WebSocket(`ws://${this._IP}:${this._PORT}`)

        this.ws.on('error', (data) => {
            console.log("ERR: ", data)
            // setTimeout(() => {
            //     this._reconnect()
            // }, 5000)
        })

        this.ws.on('open', () => {
            console.log("connected")
            this.ws.send(JSON.stringify(["mode", "color", "page", "brightness", "pages", "volume"]))

        })

        this.ws.on('close', () => {
            console.log("disconnected")
            this.connectedState = false
            setTimeout(() => {
                this._reconnect()
            }, 5000)
        })

        this.ws.on('message', (data) => {
            data = JSON.parse(data)
            this.data = {...this.data, ...data}

            if(data.page != null) {
                this.currentPage = this.data.pages[data.page]
                console.log(this.currentPage)
            }

            if(data.pages) {
                this.pageCount = data.pages.length -1
            }

            if(!this.connectedState) {
                this.connected(true)
                this.emit('connected')
            }
        })
    }

    _setSocketData(data) {
        if(this.connectedState) {
            this.ws.send(JSON.stringify(data))
        } else {
            console.log("message not sent, no connection")
        }

    }

    _getSocketData(data) {
        this.ws.send(JSON.stringify([data]))
    }

}

module.exports = Dash
