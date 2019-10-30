const ChronicleListener = require('../websockets/ChronicleListener')
const MessageSubscription = require('./MessageSubscription')

class MessageRouter {

    constructor(chroniclePort = 8800) {
        this.chronicleListener = new ChronicleListener(this, chroniclePort)
        this.channels = {}
    }

    async start() {
        console.log("MessageRouter starting ChronicleListener")
        await this.chronicleListener.start()
    }

    stop() {
        this.chronicleListener.stop()
    }

    handleMessage(message) {
        if (!this.channels[message.getChannel()])
            return

        let subscriptions = this.channels[message.getChannel()][message.getTopic()]

        if (!subscriptions)
            return

        for (let i = 0; i < subscriptions.length; i++) {
            try {
                subscriptions[i].handle(message.getMessage())
            } catch (e) {
                console.error(`Exception when handling subscription: ${e}`)
            }
        }
    }

    subscribe(subscription) {
        if (!(subscription instanceof MessageSubscription))
            return

        let topic = subscription.getTopic()
        let channel = subscription.getChannel()
        let channelSubscriptions = this.channels[channel]

        if (!channelSubscriptions) {
            channelSubscriptions = {}
            this.channels[channel] = channelSubscriptions
        }

        if (!channelSubscriptions[topic])
            channelSubscriptions[topic] = []

        channelSubscriptions[topic].push(subscription)
    }

    unsubscribe(subscription) {
        if (!(subscription instanceof MessageSubscription))
            return

        let topic = subscription.getTopic()
        let channel = subscription.getChannel()
        let id = subscription.getId()
        
        if (!this.channels[channel])
            return

        let topicSubscriptions = this.channels[channel][topic]
        if (!topicSubscriptions)
            return

        for (let i = 0; i < topicSubscriptions.length; i++) {
            if (topicSubscriptions[i].getId() == id) {
                topicSubscriptions.splice(i, 1)
                break
            }
        }
    }
}

module.exports = MessageRouter