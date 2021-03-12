# Dash Socket API wrapper
## Allows interfacing to Open Dash via the Socket API



A single wrapper class that exposes setters and getters for various functions and values within dash.

Dash can be found here: https://github.com/openDsh/dash

## Installation

```nodejs
npm install dash-socket-api
```

## Usage

The test.js file can be used to test all available methods, comment out the not required commands, these are also show below



```js
const Dash = require('dash-socket-api')
const dash = new Dash('192.168.0.6', 54545);

dash.on('connected', () => {
    //change dash page using string name
    dash.page("Camera");

    //change dash page using string key
    dash.cyclePage();

    //change dash page using array index
    dash.page(0);

    //get current page
    console.log(dash.page());

    //change mode
    dash.mode('Dark');

    //get current mode
    console.log(dash.mode());

    //change colour
    dash.color('#FF69B4');

    //get colour
    console.log(dash.color());

    //change brightness
    dash.brightness(150);

    //get brightness
    console.log(dash.brightness());

    //change volume
    dash.volume(100);

    //get volume
    console.log(dash.volume());

});
```