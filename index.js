const Dash = require('./client')

const dash = new Dash("192.168.0.6", 54545)
let page = 0
dash.on('connected', () => {
    dash.page("Android Auto")
})

setInterval(() => {
    if(page >= dash.pageCount) {
        page = 0
    } else {
        page += 1
    }
    dash.page(page)
}, 1500)