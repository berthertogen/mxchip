#!/usr/bin/env python

# --------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
# --------------------------------------------------------------------------------------------

"""
An example to show receiving events from an Event Hub.
"""
import os
import json
from azure.eventhub import EventHubConsumerClient
from dotenv import load_dotenv
from datetime import datetime
from pymongo import MongoClient
from pprint import pprint
from events import Events

load_dotenv()

EVENTHUB_CONNECTION_STRING = os.environ["EVENTHUB_CONNECTION_STRING"]
CONSUMER_GROUP_NAME = os.environ['CONSUMER_GROUP_NAME']
MONGODB = os.environ['MONGODB']


def on_event(partition_context, event):
    # Put your code here.
    # If the operation is i/o intensive, multi-thread will have better performance.
    print("Received event from partition: {} {}.".format(partition_context.partition_id, event.enqueued_time))
    write_event(event)

def on_partition_initialize(partition_context):
    # Put your code here.
    print("Partition: {} has been initialized.".format(partition_context.partition_id))


def on_partition_close(partition_context, reason):
    # Put your code here.
    print("Partition: {} has been closed, reason for closing: {}.".format(
        partition_context.partition_id,
        reason
    ))


def on_error(partition_context, error):
    # Put your code here. partition_context can be None in the on_error callback.
    if partition_context:
        print("An exception: {} occurred during receiving from Partition: {}.".format(
            partition_context.partition_id,
            error
        ))
    else:
        print("An exception: {} occurred during the load balance process.".format(error))

def write_event(event):
    events.write_event(event)

if __name__ == '__main__':
    consumer_client = EventHubConsumerClient.from_connection_string(
        conn_str=EVENTHUB_CONNECTION_STRING,
        consumer_group=CONSUMER_GROUP_NAME
    )

    events=Events(MONGODB)
    lastEvent=events.last_written()
    start_position="-1" if lastEvent is None else lastEvent['enqueued_time']
    print('Getting events starting from {0} last event {1}', start_position, lastEvent)

    try:
        with consumer_client:
            consumer_client.receive(
                on_event=on_event,
                on_partition_initialize=on_partition_initialize,
                on_partition_close=on_partition_close,
                on_error=on_error,
                starting_position=start_position
            )
    except KeyboardInterrupt:
        print('Stopped receiving.')