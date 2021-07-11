const { EventHubConsumerClient } = require("@azure/event-hubs");
const { InteractiveBrowserCredential } = require("@azure/identity");
const {
  appClientId,
  appTenantId,
  consumerGroup,
  eventHubName,
  fullyQualifiedNamespace
} = require("./configuration");

const contentContainer = document.getElementById("receiveContent");
function outputLog(text) {
  const currentContent = contentContainer.value;
  contentContainer.value = `${currentContent}${text}\n`;
}

async function receive() {
  const credential = new InteractiveBrowserCredential({
    tenantId: appTenantId,
    clientId: appClientId
  });

  const consumerClient = new EventHubConsumerClient(
    consumerGroup,
    fullyQualifiedNamespace,
    eventHubName,
    credential
  );
  const partitionIds = await consumerClient.getPartitionIds();
  outputLog(`Preparing to read events from partitions: ${partitionIds.join(", ")}`);

  consumerClient.subscribe(
    {
      // The callback where you add your code to process incoming events
      processEvents: async (events, context) => {
        for (const event of events) {
          outputLog(
            `Received event: '${event.body}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`
          );
        }
      },
      processError: async (err) => {
        outputLog(`Error : ${err}`);
      }
    },
    {
      maxWaitTimeInSeconds: 5
    }
  );
}

receive();