import React from "react";
import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();

  // console.log(router);
  React.useEffect(() => {
    if (!loading && !data?.me) {
      router.replace('/login?next=' + router.pathname);
    }
  }, [loading, data, router]);
};

