import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'my-server-app',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  logLevel: logLevel.INFO // disables all logs
});

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: 'my-group' });

export const kafkaProducer = producer;
export const kafkaConsumer = consumer;


export const connectKafka = async () => {
  await producer.connect();
  await consumer.connect(); // only if you're using the consumer
  console.log('✅ Kafka connected (producer and consumer)');
};