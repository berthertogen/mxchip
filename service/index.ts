import express from 'express';
import { EventHubConsumerClient, earliestEventPosition } from "@azure/event-hubs";

import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env["EVENTHUB_CONNECTION_STRING"] || "";
const consumerGroup = process.env["CONSUMER_GROUP_NAME"] || "";

const app = express();

app.get('/', (req, res) => {
  res.send('Well done!');
})

app.get('/now', async (req, res) => {
  console.log(`Running receiveEvents sample`);

  const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString);

  const subscription = consumerClient.subscribe(
    {
      processEvents: async (events, context) => {
        for (const event of events) {
          console.log(
            `Received event: '${event.body}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`
          );
        }
        res.send(events);
      },
      processError: async (err, context) => {
        console.log(`Error on partition "${context.partitionId}": ${err}`);
        res.send(err);
      }
    },
    { startPosition: earliestEventPosition }
  );

  setTimeout(async () => {
    await subscription.close();
    await consumerClient.close();
    console.log(`Exiting receiveEvents sample`);
  }, 3 * 1000);
})

app.listen(3000, () => {
  console.log("connectionString", connectionString);
  console.log("consumerGroup", consumerGroup);
  console.log('The application is listening on port 3000!');
})
