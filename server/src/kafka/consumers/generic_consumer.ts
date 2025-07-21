import { kafka } from "../kafka";
import { AppEvent } from "../publishEvent";

type KafkaEventHandler = (event: AppEvent) => Promise<void>;

export const createConsumer = async (
  topic: string,
  groupId: string,
  handler: KafkaEventHandler
) => {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      let event: AppEvent;
      try {
        event = JSON.parse(message.value.toString());
      } catch (err) {
        console.error(`[Kafka] Invalid message on ${topic}:`, err);
        return;
      }

      await handler(event);
    },
  });
};


export const runUserRegister = () => {
  return createConsumer('user.registered', 'user-registered-group', async (event) => {
    console.log('✅ New user registered:', event.payload);
  });
};

export const runUserLogin = () => {
  return createConsumer('user.loggedin', 'user.loggedin-group', async (event) => {
    console.log('✅ Auth User loged in:', event.payload);
  });
};

export const runUserLogout = () => {
  return createConsumer('user.loggedout', 'user.loggedout-group', async (event) => {
    console.log('✅ Auth User logged out:', event.payload);
  });
};

export const runPostCreate = () => {
  return createConsumer('post.created', 'post.created-group', async (event) => {
    console.log('✅ Auth User created a post:', event.payload);
  });
};

export const runPostUpdate = () => {
  return createConsumer('post.updated', 'post.updated-group', async (event) => {
    console.log(`✅ Auth User updated post: ${event.payload.title} : `, event.payload);
  });
};

export const runPostDelete = () => {
  return createConsumer('post.deleted', 'post.deleted-group', async (event) => {
    console.log(`✅ Auth User deleted post: ${event.payload.title}`, event.payload);
  });
};

export const runUserPasswordChanged = () => {
  return createConsumer('user.password.changed', 'user.password.changed-group', async (event) => {
    console.log(`✅ User password change: ${event.payload.title}`, event.payload);
  });
};

export const runUserForgotPassword = () => {
  return createConsumer('user.forgotpassword', 'user.password.forgot-group', async (event) => {
    console.log(`✅ User forgot password: ${event.payload.title}`, event.payload);
  });
};

export const runPostRead = () => {
  return createConsumer('post.read', 'post.read-group', async (event) => {
    console.log(`✅ User read post: ${event.payload.title}`, event.payload);
  });
};

export const runUserUpdated = () => {
  return createConsumer('user.updated', 'user.updated-group', async (event) => {
    console.log(`✅ User update fields: ${event.payload.title}`, event.payload);
  });
};

export const runUserVoted = () => {
  return createConsumer('user.voted', 'user.voted-group', async (event) => {
    console.log(`✅ User vote for a post: ${event.payload.title}`, event.payload);
  });
};

//! can make a generic consumer for query to show how many people see it,
//! i will just keep track how may queries is included/  get a single post /
