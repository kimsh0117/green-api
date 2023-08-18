const { QUEUE_NAME } = require('../constants');
const MessageService = require("../service/Message");

class App {
    static _instance
    messageService
    constructor() {
        this.messageService = MessageService.getInstance()
    }
    static getInstance() {
        if(!App._instance) {
            App._instance = new App()
        }
        return App._instance;
    }

    async initAmqp() {
        // listen amqp server
        try {
            await this.messageService.connect()
            await this.messageService.receive(QUEUE_NAME, 'M2', true);
        } catch (error) {
            console.error('Error starting ampq server 2:', error);
        }
        return this;
    }
}

const app = App.getInstance()

app.initAmqp()


