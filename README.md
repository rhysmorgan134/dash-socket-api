# Dash Socket API wrapper
## Allows interfacing to Open Dash via the Socket API



A single wrapper class that exposes setters and getters for various functions and values within dash.

## Installation

```nodejs
npm install dash-socket-api
```

## Usage

The example folder shows all current supported methods, these are also show below

```js
const Dash = require('dash-socket-api')

const dash = new Dash("localhost", 54545)

dash.on('connected', () => {
    //change dash page using string name
    dash.page("Android Auto")

    //change dash page using string key
    dash.page("page4")

    //change dash page using array index
    dash.page(0)

    //get current page
    console.log(dash.page())

    //change mode
    dash.mode('Dark')

    //get current mode
    console.log(dash.mode())

    //change colour
    dash.color('#FF69B4')

    //get colour
    console.log(dash.color())

    //change brightness
    dash.brightness(150)

    //get brightness
    console.log(dash.brightness())

    //change volume
    dash.volume(70)

    //get volume
    console.log(dash.volume())


})
```