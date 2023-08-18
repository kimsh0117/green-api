const express = require('express');
const {M1_SERVER_PORT,QUEUE_NAME} = require('../constants');
const mainRouter = require("../routes");
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
    initHttp() {
        const app = express();
        app.use('/', mainRouter);
        // listen http server.
        app.listen(M1_SERVER_PORT, () => {
            console.log(`Http server is running on port ${M1_SERVER_PORT}`);
        });
        return this;
    }

    async initAmqp() {
        // listen amqp server
        try {
            await this.messageService.connect()
            await this.messageService.receive(QUEUE_NAME, 'M1');
        } catch (error) {
            console.error('Error starting amqp server M1:', error);
        }
        return this;
    }
}

const app = App.getInstance()

app.initHttp()
app.initAmqp()
