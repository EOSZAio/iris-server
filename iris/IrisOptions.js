const opts = [
    {
        name: 'help', alias: 'h',
        type: Boolean,
        description: 'Display this usage guide.'
    },
    //{ name: 'verbose', alias: 'v', type: Boolean },
    {
        name: 'chronicle-port', alias: 'c',
        type: Number,
        description: "The port to listen on for incoming connection from chronicle, this is the exp-ws-port value from chronicle's config.ini (default 8800).",
        defaultValue: 8800
    },
    {
        name: 'web-port1', alias: 'x',
        type: Number,
        description: "The port that will be exposed to the coolx web for incoming posts (default 8080).",
        defaultValue: 8080
    },
    {
        name: 'web-port2', alias: 'e',
        type: Number,
        description: "The port that will be exposed to the ezar web for incoming posts (default 8081).",
        defaultValue: 8081
    }
]

const usage = [
    {
        header: 'Iris Server',
        content: 'A webserver handling EOSIO watcher services'
    },
    {
        header: 'Options',
        optionList: opts
    },
    {
        content: 'Project home: {underline https://github.com/eoszaio/iris-server}'
    }
]

module.exports = { opts, usage }