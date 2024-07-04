const amqp = require('amqplib/callback_api');

const RABBITMQ_URL = 'amqp://localhost';

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log("Usage: consumer.js <pattern>");
  process.exit(1);
}

const pattern = args[0];

amqp.connect(RABBITMQ_URL, (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    const exchange = 'topic_logs';
    const queue = 'letterbox';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.assertQueue(queue, {
      durable: true // Make the queue durable
    }, (error2, q) => {
      if (error2) {
        throw error2;
      }
      console.log(`[*] Waiting for logs matching pattern '${pattern}' in queue '${queue}'. To exit press CTRL+C`);

      channel.bindQueue(q.queue, exchange, pattern);

      channel.consume(q.queue, (msg) => {
        console.log(`[x] ${msg.fields.routingKey}: '${msg.content.toString()}'`);
      }, {
        noAck: true
      });
    });

    channel.prefetch(1);
  });
});
