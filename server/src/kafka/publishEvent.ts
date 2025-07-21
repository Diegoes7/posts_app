import { kafkaProducer } from './kafka';

export type AppEvent = {
  event: string;                        //* e.g. "user.registered"
  timestamp: string;                    //* ISO timestamp
  actorId?: number | string;            //* user who triggered the action
  description?: string;                 //* optional description of the event
  payload: Record<string, any>;         //* data related to the event
};


// const producer = kafka.producer();  //! need to think over

export const publishEvent = async (
  event: AppEvent['event'],
  payload: AppEvent['payload'],
  actorId?: AppEvent['actorId']
): Promise<void> => {
  const message: AppEvent = {
    event,
    timestamp: new Date().toISOString(),
    actorId,
    payload,
  };

  await kafkaProducer.send({
    topic: event, // direct topic = event name
    messages: [
      {
        key: actorId ? String(actorId) : undefined,
        value: JSON.stringify(message),
      },
    ],
  });
};
