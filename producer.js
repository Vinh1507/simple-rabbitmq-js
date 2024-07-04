const amqp = require('amqplib/callback_api');

const RABBITMQ_URL = 'amqp://localhost';

const args = process.argv.slice(2);
if (args.length == 0) {
  process.exit(1);
}

const producerNumber = args[0];

function sendMessage(routingKey, message) {
  amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const exchange = 'topic_logs';

      channel.assertExchange(exchange, 'topic', {
        durable: false
      });

      channel.publish(exchange, routingKey, Buffer.from(message));
      console.log(`[x] Sent ${routingKey}: '${message}'`);
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  });
}

// Simulate multiple producers with different routing keys
const messages = [
  { routingKey: 'quick.orange.rabbit', message: 'Message 1: ' + producerNumber},
  { routingKey: 'lazy.orange.elephant', message: 'Message 2: ' + producerNumber},
  { routingKey: 'quick.orange.fox', message: 'Message 3: ' + producerNumber},
  { routingKey: 'lazy.brown.fox', message: 'Message 4: ' + producerNumber},
  { routingKey: 'quick.brown.fox', message: 'Message 5: ' + producerNumber},
  { routingKey: 'lazy.brown.fox', message: 'Message 6: ' + producerNumber},
  { routingKey: 'lazy.brown.fox', message: 'Message 7: ' + producerNumber},
  { routingKey: 'lazy.brown.fox', message: 'Message 8: ' + producerNumber},
  { routingKey: 'lazy.brown.fox', message: 'Message 9: ' + producerNumber},
  { routingKey: 'lazy.brown.fox', message: 'Message 10: ' + producerNumber },
  { routingKey: 'lazy.brown.fox', message: 'Message 11: ' + producerNumber },
];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

messages.forEach((msg, index) => {
  setTimeout(() => sendMessage(msg.routingKey, msg.message), getRandomInt(1, 5) * 1000);
});
