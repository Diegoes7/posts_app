import DataLoader from 'dataloader';
import { User } from '../entities/User';
import { In } from 'typeorm';

// const createUserLoader = new DataLoader(keys => myBatchGetUsers(keys));
//! take batch function, which takes keys => data for all the keys
// [] with the same size of keys, where data lines with the key

//! modern way 
export const createUserLoader = () => new DataLoader<number, User>(async (userIds) => {
  const users = await User.findBy({
    id: In(userIds as number[]),
  });

  const userIdToUserObject: Record<number, User> = {};

  users.forEach((user) => {
    userIdToUserObject[user.id] = user;
  });

  return userIds.map((userId) => userIdToUserObject[userId]);
});


// export const createUserLoader = () => new DataLoader<number, User>(async (userIds) => {
//   const users = await User.findByIds(userIds as number[]);

//   const userIdToUserObject: Record<number, User> = {};

//   users.forEach((user) => {
//     userIdToUserObject[user.id] = user;
//   });

//   return userIds.map((userId) => userIdToUserObject[userId]);
// });