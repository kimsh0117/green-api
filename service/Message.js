const amqp = require('amqplib');

// Singleton instance
class Message {
    static _instance
    channel
    constructor() {
    }
    static getInstance() {
        if(!Message._instance) {
            Message._instance = new Message()
        }
        return Message._instance;
    }
    async connect() {
        try {
            const connection  = await amqp.connect('amqp://guest:guest@localhost');
            this.channel = await connection.createChannel();
        } catch(error) {
            console.error('Connecting to RabbitMQ failed', error);
        }
    }
    async close() {
        try {
            if(this.channel) {
                await this.channel.close();
            }
        } catch (error) {
            console.error('Closing connection to RabbitMQ failed', error);
        }
    }
    async send(message, queueName) {
        try {
            await this.connect()

            await this.channel.assertQueue(queueName);
            await this.channel.sendToQueue(queueName, Buffer.from(message));
            console.log('Message sent to RabbitMQ:', message);
        } catch (error) {
            console.error('Error sending message to RabbitMQ:', error);
        }
    }

    async receive(queueName, serverName, isResend = false) {
        if(this.channel) {
            await this.channel.assertQueue(queueName);
            console.log(`Server ${serverName} is waiting for messages...`);

            this.channel.consume(queueName, (message) => {
                if (message) {
                    const receivedMessage = message.content.toString();
                    console.log(`Received message from Server ${serverName === 'M1' ? 'M2' : 'M1'}:`, receivedMessage);
                    if(isResend){
                        this.send(`${serverName} server message`, queueName);
                    }
                }
            }, { noAck: true });
        }
    }
}

module.exports = Message