from pymongo import MongoClient

class Events:
    
    def __init__(self, connectionString):
        print("Checking db connection...")
        self.client = MongoClient(connectionString)
        db=self.client.mxchip
        serverStatusResult=db.command("serverStatus")
        print('Connection made to ', serverStatusResult['host'])

    def write_event(self, event):
        eventJson={
            **event.body_as_json(encoding='UTF-8'),
            'enqueued_time':event.enqueued_time,
            'offset':event.offset,
            'sequence_number':event.sequence_number,
        }
        result=self.client.mxchip.events.insert_one(eventJson)
        print('Created {0} occuring on {1}'.format(result.inserted_id, event.enqueued_time))

    def last_written(self):
        if "mxchip" in self.client.database_names() and "events" in self.client.mxchip.list_collection_names():
            return self.client.mxchip.events.find().sort('sequence_number', -1).limit(1)[0]
        else:
            return None
