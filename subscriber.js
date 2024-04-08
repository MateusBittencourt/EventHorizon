import { connect } from 'amqplib/callback_api.js';

/**
 * Subscribes to a message queue.
 * 
 * @param {string} channelName - The working queue.
 * @param {string} routingGroup - The routing group.
 * @param {Function} handler - The handler function.
 * @param {string} type - The type of event.
 */
const subscribe = async (channelName, routingGroup, handler, type = 'event') => {
    const username = process.env.RABBITMQ_USERNAME
    const password = process.env.RABBITMQ_PASSWORD
    const host = process.env.IP
    const port = process.env.RABBITMQ_PORT

    connect(`amqp://${username}:${password}@${host}:${port}`, function(error0, connection) {
        if (error0) {
            console.log(error0);
            throw error0;
        }
        connection.createChannel(async function(error1, channel) {
            if (error1) {
                console.log(error1);
                throw error1;
            }

            const exchange = channelName;
            const queue = routingGroup;
            const routingKey = `${channelName}.${type}`;

            await channel.assertExchange(exchange, 'direct', { durable: false });

            await channel.assertQueue(queue, { exclusive: false }, async function(error2, q) {
                if (error2) {
                    throw error2;
                }
                // console.log(" [*] Waiting for messages in %s.", q.queue);

                await channel.bindQueue(q.queue, exchange, routingKey);

                channel.consume(q.queue, function(msg) {
                    if (msg.content) {
                        const message = JSON.parse(msg.content.toString());
                        handler(message);
                    }
                }, { noAck: true });
            });
        });
    });
}

export default subscribe;