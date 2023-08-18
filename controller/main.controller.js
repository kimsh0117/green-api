const {QUEUE_NAME } = require('../constants');
const MessageService = require('../service/Message');
const main = async (req, res) => {
    const messageService = MessageService.getInstance()

    await messageService.send('M1 server message', QUEUE_NAME);
    await messageService.close()
    return res.status(200);
}

module.exports = {
    main,
}