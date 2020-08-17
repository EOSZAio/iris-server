const config = require('../config');
const express = require('express')
const bodyParser = require("body-parser")
//const MessageRouter = require('../routing/MessageRouter')
const MessageSubscription = require('../routing/MessageSubscription')
const JWTService = require('../jwt/JWTService')
const axios = require('axios')
const jwtEnabled = false //for verifcation only

class CoolxPostListener {

  constructor(messageRouter, webport = 8080) {
      this.app = express();
      console.log(`Start webserver, ${webport}`)
      this.server = this.app.listen(webport)
      this.app.use(bodyParser.urlencoded({extended: false}))
      this.app.use(bodyParser.json())

      this.mr = messageRouter
      this.chain_id = '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'
      this.subscriptions = {}
      this.jwt = new JWTService()
      this.ezar_url = config.ezar_url;
      this.coolx_url = config.coolx_url;

  }

  start() {
    
    this.app.post("/addSubscription", this.addSubscription.bind(this))
    this.app.post("/addSubscriptionList", this.addSubscriptionList.bind(this))
    this.app.post("/unsubscribe", this.unsubscribe.bind(this))
    this.app.post("/addAction", this.addAction.bind(this))

    //Hardcoded for now
    this.subscribeAction("zar.tbn", "result")
    this.subscribeAction("qbe.tbn", "result")
    this.subscribeAction("dac.tbn", "result")
    this.subscribeAction("rev.tbn", "result")
    this.subscribeAction("sql.tbn", "result")
    this.subscribeAction("san.tbn", "result")
    this.subscribeEzarAction("zar", "trxreport")
    
    //this.getAccountListFromAPI()
  }

  stop() {
    this.server.close(()=>{console.log('Process terminated')});
  }

  getAccountListFromAPI() {
    axios.get('https://walletapi.coolx.io/api/v2/account/list').then(
      (response) => {
        let accounts = response.data.accounts
        accounts.forEach(data => this.subscribeTransfer(data));
      }
    ).catch((error) => {
      console.error(error)
    })
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
    let subscriptionTransfer = MessageSubscription.actionSubscription(contract, action, this.bancorHandler.bind(this))
    this.subscribe(subscriptionTransfer)
  }

  subscribeEzarAction(contract, action){
    console.log(`subscribe contract: ${contract}, subscribe action: ${action}`)
    let subscriptionTransfer = MessageSubscription.actionSubscription(contract, action, this.ezarHandler.bind(this))
    this.subscribe(subscriptionTransfer)
  }

  subscribeTransfer(account){
    console.log(`subscribe account: ${account}`)
    let subscriptionTransfer = MessageSubscription.transferSubscription(account, this.handler.bind(this))
    this.subscribe(subscriptionTransfer)
  }

  addAction(req, resp) {
    this.subscribeAction(req.body.contract, req.body.action)
    resp.end("200")
  }

  addSubscription(req, resp) {
    if (jwtEnabled) {
      let verifiedData = this.jwt.verify(req.body.token)
      if (verifiedData){
        this.subscribeTransfer(verifiedData.account)
        resp.end("200")
      }
      else {
        resp.error("Unverified payload")
      }
    }
    else {//JWT disabled
      this.subscribeTransfer(req.body.account)
      resp.end("200")
    }
    
  }

  addSubscriptionList(req, resp) {
    let accounts = req.body.accounts
    accounts.forEach(data => this.subscribeTransfer(data));
    resp.end("200")
  }

  handler(message) {
    console.log(`TRANSFER - message - ${JSON.stringify(message)}`)
    //Send to EZAR API
    if (message.from == "zartknissuer" || message.to == "zartknissuer") {
      let payload = this.jwt.sign(message)
      /*let config = {
        headers: {
          contentType: 'application/json'
        }
      }*/
      axios.post(`${this.ezar_url}api/v1/Transaction/Notify`, payload)
      .then((res) => {
        console.log(`${this.ezar_url}api/v1/Transaction/Notify: ${res.status} and ${res.statusText}`)
      })
      .catch((error) => {
        console.error(error)
      })
    }
    else{ //Send to COOLX API
      let payload = `chainId=${this.chain_id}&transactionId=${message.trx_id}`;
      axios.post(`https://walletapi.coolx.io/api/v2/Message?${payload}`,  "")
      .then((res) => {
        console.log(`https://walletapi.coolx.io/api/v2/Message?: ${res.status} and ${res.statusText}`)
      })
      .catch((error) => {
        console.error(error)
      })
    }
  }

  bancorHandler(message) {
    console.log(`Action - message - ${JSON.stringify(message)}`)
    //Send to BANCOR API on COOLX
    let payload = this.jwt.sign(message)
    //console.log(`Action - jwt - ${payload}`)
    axios.post(`https://us-central1-coolx-242811.cloudfunctions.net/processTrade`, payload)
    .then((res) => {
      console.log(`https://us-central1-coolx-242811.cloudfunctions.net/processTrade: ${res.status} and ${res.statusText}`)
    })
    .catch((error) => {
      console.error(error)
    })
  }

  ezarHandler(message) {
    //https://dev.api.ezar.co.za/api/v1/wallet/PostMessage?MessageType=0&AccountName=virtual_acountname
    console.log(`Action - message - ${JSON.stringify(message)}`)
    //Send to EZAR API
    let payload = this.jwt.sign(message)
    //console.log(`Action - jwt - ${payload}`)
    axios.post(`${this.ezar_url}api/v1/wallet/PostMessage`, payload)
    .then((res) => {
      console.log(`${this.ezar_url}api/v1/wallet/PostMessage: ${res.status} and ${res.statusText}`)
    })
    .catch((error) => {
      console.error(error)
    })
  }

  unsubscribe(req, resp) {
    let { channel, topic } = req.body
    let subscription = this.getSubscription(channel, topic)
    resp.end("200")

    delete this.subscriptions[channel][topic]
    this.mr.unsubscribe(subscription)
    console.log(`Unsubscribe request for channel ${channel} and topic ${topic}`)
  }


  getSubscription(channel, topic) {
    return this.subscriptions[channel][topic]
  }

  getSubscriptions() {
    return this.subscriptions
  }

}
module.exports = CoolxPostListener