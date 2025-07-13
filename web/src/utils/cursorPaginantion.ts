import { Entity, Resolver } from "@urql/exchange-graphcache";
import { stringifyVariables } from "urql";

//! function return a client site resolver
export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    console.log('all Fields: ', allFields);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);

    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    console.log('entity info: ', allFields);
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    console.log('field key: ', fieldKey);
    const isInCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, "posts");
    console.log('is in cache: ', !isInCache);
    info.partial = !isInCache;
    let hasMore = true;
    const result: string[] = [];
    fieldInfos.forEach(fi => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string[] | null;
      const data = cache.resolve(key as Entity, 'posts') as string[];
      console.log('data', data)
      const _hasMore = cache.resolve(key as Entity, 'hasMore');
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      result.push(...data);
    });
    const obj = {
      __typename: "PaginatedPosts",
      hasMore,
      posts: result
    };
    console.log(obj);
    return obj;
  };
};