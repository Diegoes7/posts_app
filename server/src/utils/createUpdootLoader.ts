import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

//! Modern way after findByIds is depricated
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number; }, Updoot | null>(async (keys) => {
    const updoots = await Updoot.createQueryBuilder("updoot")
      .where(
        keys.map((key, index) =>
          `(updoot."postId" = :postId${index} AND updoot."userId" = :userId${index})`
        ).join(" OR "),
        Object.fromEntries(
          keys.flatMap((key, index) => [
            [`postId${index}`, key.postId],
            [`userId${index}`, key.userId],
          ])
        )
      )
      .getMany();

    const updootMap: Record<string, Updoot> = {};
    updoots.forEach(updoot => {
      updootMap[`${updoot.userId}|${updoot.postId}`] = updoot;
    });

    return keys.map(
      key => updootMap[`${key.userId}|${key.postId}`] ?? null
    );
  });

//* old way
// export const createUpdootLoader = () => new DataLoader<{ postId: number, userId: number; }, Updoot | null>(
//   async (keys) => {
//     const updoots = await Updoot.findByIds(keys as any);
//     const updootIdToUpdootObject: Record<string, Updoot> = {};

//     updoots.forEach((updoot) => {
//       updootIdToUpdootObject[`${updoot.userId}|${updoot.postId}`] = updoot;
//     });

//     return keys.map(key => updootIdToUpdootObject[`${key.userId}|${key.postId}`]);
//   });

