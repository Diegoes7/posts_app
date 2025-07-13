import {
  DeletePostMutationVariables,
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from '../generated/graphql';
import { Cache, QueryInput, cacheExchange } from '@urql/exchange-graphcache';
import { cursorPagination } from './cursorPaginantion';
import { gql } from 'urql';

function invalidateAllPosts(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter(info => info.fieldName === 'posts');
  fieldInfos.forEach(fi => {
    cache.invalidate('Query', 'posts', fi.arguments || {});
  });
}

//! helper function to enhance better types
function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  res: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(res, data as any) as any);
}

//! update the cache to render right information /data/
const customCacheExchange = cacheExchange({
  keys: {
    PaginatedPosts: () => null,
  },
  resolvers: {
    Query: {
      posts: cursorPagination(),
    }
  },
  updates: {
    Mutation: {
      deletePost: (result, args, cache, info) => {
        cache.invalidate({ __typename: 'Post', id: (args as DeletePostMutationVariables).id });
      },
      vote: (result, args, cache, info) => {
        const { postID, value } = args as VoteMutationVariables;
        const data = cache.readFragment(
          gql`
            fragment _ on Post {
              id
              points
              voteStatus
            }
          `,
          { id: postID } as any
        );
        console.log('data: ', data.points);
        if (data) {
          if (data.voteStatus === value) {
            return;
          }

          const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
          cache.writeFragment(
            gql`
            fragment __ on Post {
              points
              voteStatus
            }
          `,
            { id: postID, points: newPoints, voteStatus: value }
          );
        }
      },
      createPost: (result, args, cache, info) => {
        invalidateAllPosts(cache);
      },
      logout: (result, args, cache, info) => {
        betterUpdateQuery<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          result,
          () => ({ me: null })
        );
      },
      login: (result, args, cache, info) => {
        betterUpdateQuery<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          result,
          (res, query) => {
            if (res.login.errors) {
              return query;
            } else {
              return {
                me: res.login.user,
              };
            }
          }
        );
        invalidateAllPosts(cache);
      },
      register: (result, args, cache, info) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(
          cache,
          { query: MeDocument },
          result,
          (res, query) => {
            if (res.register.errors) {
              return query;
            } else {
              return {
                me: res.register.user,
              };
            }
          }
        );
      },
    },
  },
});

export default customCacheExchange;