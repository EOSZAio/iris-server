const { CoolxPostListener, EzarPostListener, BlacqMarketPostListener, MessageRouter } = require('./index')
const JWTService = require('./jwt/JWTService')
const axios = require('axios')
let mr = new MessageRouter()
mr.start()

let coolx = new CoolxPostListener(mr)
let ezar = new EzarPostListener(mr)
let blacq = new BlacqMarketPostListener(mr)

let jwt = new JWTService()
var coolxAccounts = [
  "acornaccount",
  "eosio.token",
  "greencointls",
  "ourbmstokens",
  "qubicletoken",
  "revelation21",
  "stablecarbon",
  "stablecoin.z",
  "stablecoinro",
  "telosdacdrop"
]

/*axios.post('http://history.telos.africa:3000/unsubscribe',  { channel: '2', topic: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
   
  })
  .catch((error) => {
    console.error(error)
   
  })*/

/*axios.post('http://history.telos.africa:3000/addSubscription',  { account: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error(error)
  })*/
  
  /*let payload = { accounts: coolxAccounts }
  let token = jwt.sign(payload)
  axios.post('http://127.0.0.1:8080/addSubscriptionList',  token )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error("error")
  })*/

  /*let payload = { account: 'coolxtestwlt' }
  let token = jwt.sign(payload)
  axios.post('http://127.0.0.1:8080/addSubscription',  { token } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
  })
  .catch((error) => {
    console.error("error")
    
  })*/

  /*axios.post('http://10.0.0.85:3000/addSubscription',  { account: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    
  })
  .catch((error) => {
    console.error(error)
  })



  /*axios.post('http://127.0.0.1:8080/unsubscribe',  { channel: '2', topic: 'coolxtestwlt' } )
  .then((res) => {
    console.log(`statusCode: ${res.data}`)
    pl.getSubscriptions()
    
  })
  .catch((error) => {
    console.error("error")
   
  })*/

coolx.start()
ezar.start()
blacq.start()
