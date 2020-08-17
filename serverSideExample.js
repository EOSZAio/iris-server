const { MessageRouter, MessageSubscription } = require('./index')
const { CoolxPostListener } = require('./index')
const util = require('util')


let mr = new MessageRouter()
let coolx = new CoolxPostListener(mr)


/*let testSubscription = MessageSubscription.actionSubscription('stablecoin.z', 'transfer', function (message) {
    console.log(`ACTION - eosio.token::issue message - ${JSON.stringify(message, null, 4)}`)
})

let testSubscriptionNewAccount = MessageSubscription.actionSubscription('eosio', 'newaccount', function (message) {
    console.log(`ACTION - eosio.token::newaccount message - ${message.trace.act.data.name}`)
})

let testSubscriptionTransfer = MessageSubscription.transferSubscription('qwertyqwerty', function (message) {
    console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
})
let testSubscriptionTransfer2 = MessageSubscription.transferSubscription('zartknissuer', function (message) {
  console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
})

//mr.subscribe(testSubscription)
//mr.subscribe(testSubscriptionNewAccount)
mr.subscribe(testSubscriptionTransfer)
mr.subscribe(testSubscriptionTransfer2)*/

let testSubscription1 = MessageSubscription.actionSubscription('eosio.token', 'transfer', function (message) {
  //console.log(`ACTION - eosio.token::transfer message - ${JSON.stringify(message, null, 4)}`)
})

let testSubscription2 = MessageSubscription.actionSubscription('eosio.token', 'issue', function (message) {
  //console.log(`ACTION - eosio.token::transfer message - ${JSON.stringify(message, null, 4)}`)
})

let testSubscriptionTransfer1 = MessageSubscription.transferSubscription('zartknissuer', function (message) {
  //console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
})

let testSubscriptionTransfer2 = MessageSubscription.transferSubscription('stablecoin.z', function (message) {
  //console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
})

let testSubscriptionAction3 = MessageSubscription.actionSubscription('zar.tbn', 'result', function (message) {
 // console.log(message)
  //console.log(message.trace.act.data)

  //console.log(util.inspect(myObject, {showHidden: false, depth: null}))

  // alternative shortcut
  console.log(util.inspect(message, false, null, true /* enable colors */))
  //console.log(`ACTION - zar.tbn::result message - ${message}`)
  //console.log(`ACTION - zar.tbn::result message - ${message.trace.act.data.name}`)
})

let testSubscriptionAction = MessageSubscription.actionSubscription('zar', 'trxreport', function (message) {
   console.log(util.inspect(message, false, null, true /* enable colors */))
 })

/*mr.subscribe(testSubscription1)
mr.subscribe(testSubscription2)
mr.subscribe(testSubscriptionTransfer1)
mr.subscribe(testSubscriptionTransfer2)
mr.start()

mr.unsubscribe(testSubscription1)
mr.unsubscribe(testSubscription2)
mr.unsubscribe(testSubscriptionTransfer1)
mr.unsubscribe(testSubscriptionTransfer2)*/
//mr.getSubsFile()

//pl.start()
mr.start()
mr.subscribe(testSubscriptionAction)
//mr.unsubscribe(testSubscription1)