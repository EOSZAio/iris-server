const config = require('../config');
const express = require('express')
const bodyParser = require("body-parser")
//const MessageRouter = require('../routing/MessageRouter')
const MessageSubscription = require('../routing/MessageSubscription')
const JWTService = require('../jwt/JWTService')
const axios = require('axios')
const jwtEnabled = false //for verifcation only

class BlacqMarketPostListener {

  constructor(messageRouter, webport = 8082) {
      this.app = express();
      console.log(`Start webserver, ${webport}`)
      this.server = this.app.listen(webport)
      this.app.use(bodyParser.urlencoded({extended: false}))
      this.app.use(bodyParser.json())

      this.mr = messageRouter
      this.chain_id = '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'
      this.subscriptions = {}
      this.jwt = new JWTService()
      this.blacq_url = config.blacq_url;
  }

  start() {
    //Hardcoded for now
    this.subscribeAction("escrow.blacq", "logorder")
    this.subscribeAction("escrow.blacq","logsuborder")

  }

  stop() {
    this.server.close(()=>{console.log('Process terminated')});
  }

  subscribe(subscription) {
    if (!subscription.isValid()) {
        console.error(`Invalid subscription: ${JSON.stringify(subscription)}`)
        return
    }

    let channel = subscription.getChannel()
    let topic = subscription.getTopic()
    let alreadySubscribed = true
    if (!this.subscriptions.hasOwnProperty(channel)) {
        this.subscriptions[channel] = {}
        alreadySubscribed = false
    }

    if (!this.subscriptions[channel].hasOwnProperty(topic)) {
        this.subscriptions[channel][topic] = subscription
        alreadySubscribed = false
    }

    if (alreadySubscribed)
        throw new Error(`Already a subscription for channel ${channel} with topic ${topic}`)

    this.mr.subscribe(subscription)

    console.log(`Sent subscription request for channel ${channel} and topic ${topic}`)
  }

  subscribeAction(contract, action){
    console.log(`subscribe contract: ${contract}, subscribe action: ${action}`)
    let subscriptionTransfer = MessageSubscription.actionSubscription(contract, action, this.actionHandler.bind(this))
    this.subscribe(subscriptionTransfer)
  }

  addSubscriptionList(req, resp) {
    let accounts = req.body.accounts
    accounts.forEach(data => this.subscribeTransfer(data));
    resp.end("200")
  }

  actionHandler(message) {
    console.log(`ACTION - message - ${JSON.stringify(message)}`)
    let payload = this.jwt.sign(message)
    axios.post(`${this.blacq_url}v1/ezar/notify`, payload)
    .then((res) => {
      console.log(`${this.blacq_url}v1/ezar/notify: ${res.status} and ${res.statusText}`)
    })
    .catch((error) => {
      console.error(error.response)
    })
  }


  getSubscription(channel, topic) {
    return this.subscriptions[channel][topic]
  }

  getSubscriptions() {
    return this.subscriptions
  }

}
module.exports = BlacqMarketPostListener