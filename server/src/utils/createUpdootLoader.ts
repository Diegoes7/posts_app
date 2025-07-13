import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

export const createUpdootLoader = () => new DataLoader<{ postId: number, userId: number; }, Updoot | null>(
  async (keys) => {
    const updoots = await Updoot.findByIds(keys as any);
    const updootIdToUpdootObject: Record<string, Updoot> = {};

    updoots.forEach((updoot) => {
      updootIdToUpdootObject[`${updoot.userId}|${updoot.postId}`] = updoot;
    });

    return keys.map(key => updootIdToUpdootObject[`${key.userId}|${key.postId}`]);
  });