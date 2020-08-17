// TODO: get ports from process args?
// TODO: test that this can be ran from command line easily/directly now that it's the default export of index.js,
// maybe need a new file to run, think about easiest way for a sysadmin to run this, they should be able to 
// configure ports without creating a javascript file

const MessageRouter = require('../routing/MessageRouter')
const { CoolxPostListener, EzarPostListener, BlacqMarketPostListener } = require('../index')
const ClientListener = require('../websockets/ClientListener')
const optionsDef = require('./IrisOptions')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const options = commandLineArgs(optionsDef.opts)

if (options.help) {
    const usage = commandLineUsage(optionsDef.usage)
    console.log(usage)
    process.exit(1)
}

const chronicleListenerPort = options['chronicle-port']
const webport1 = isNaN(options['web-port1']) ? 8080 : options['web-port1']
const webport2 = isNaN(options['web-port2']) ? 8081 : options['web-port2']
const webport3 = isNaN(options['web-port3']) ? 8082 : options['web-port3']

const clientListenerPort = isNaN(options['websocket-port']) ? 8881 : options['websocket-port']


let mr = new MessageRouter(chronicleListenerPort)
mr.start()

let ws = new ClientListener(mr, clientListenerPort)
ws.start()

let coolx = new CoolxPostListener(mr, chronicleListenerPort, webport1)
coolx.start()

let ezar = new EzarPostListener(mr, chronicleListenerPort, webport2)
ezar.start()


let blacq = new BlacqMarketPostListener(mr, chronicleListenerPort, webport3)
blacq.start()

process.once('SIGINT', function (code) {
    console.log('\nSIGINT received...');
    ws.stop()
    coolx.stop();
    ezar.stop();
    blacq.stop();
    process.exit(1);
});

process.once('SIGTERM', function (code) {
    console.log('\nSIGTERM received...');
    coolx.stop();
    ezar.stop();
    process.exit(1);
});
