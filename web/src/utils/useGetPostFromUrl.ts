import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";

export function useGetIntID() {
  const router = useRouter();
  const currentID =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;

  return currentID;
}

export default function useGetPostFromUrl() {
  const currentID = useGetIntID();

  return usePostQuery({
    pause: currentID === -1,
    variables: {
      id: currentID,
    },
  });
}
