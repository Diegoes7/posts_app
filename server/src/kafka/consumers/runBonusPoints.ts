import { AppDataSource } from "../../db/typeorm_config";
import { User } from "../../entities/User";
import { createConsumer } from "./generic_consumer";
import { logEvent } from "../logEvent";
import { AppEvent } from "../publishEvent";

interface BonusConsumerConfig {
  topic: AppEvent['event'];
  groupId: string;
  points: number;
  description: string;
  logEventName: AppEvent['event'];
  getUserIdFromPayload: (payload: any) => number | undefined;
}

//$ event trigger by registered user consumer
export const createBonusConsumer = ({
  topic,
  groupId,
  points,
  description,
  logEventName,
  getUserIdFromPayload,
}: BonusConsumerConfig) => {
  return createConsumer(topic, groupId, async (event) => {
    const userId = getUserIdFromPayload(event.payload);
    if (!userId) {
      console.warn(`[${topic}] Invalid userId in event payload:`, event.payload);
      return;
    }

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { id: userId } });

    if (!user) {
      console.warn(`[${topic}] User not found for bonus:`, userId);
      return;
    }

    user.ratingPts = (user.ratingPts ?? 0) + points;
    await repo.save(user);

    console.log(`🏅 Added ${points} ratingPts to user ${user.username} via [${topic}]`);

    await logEvent({
      event: logEventName,
      actorId: user.id,
      timestamp: new Date().toISOString(),
      description,
      payload: {
        id: user.id,
        username: user.username,
        pointsAdded: points,
        trigger: topic,
      },
    });
  });
};


export const runUserGiftBonusConsumer = () =>
  createBonusConsumer({
    topic: "user.registered",
    groupId: "user-gift-bonus-group",
    points: 10,
    description: "Registration bonus",
    logEventName: "user.bonus-awarded",
    getUserIdFromPayload: (payload) => Number(payload?.id),
  });

export const runPostCreatedBonusConsumer = () =>
  createBonusConsumer({
    topic: "post.created", 
    groupId: "post-bonus-group",
    points: 5,
    description: "Post creation bonus",
    logEventName: "user.post-bonus",
    getUserIdFromPayload: (payload) => Number(payload?.id),
  });
