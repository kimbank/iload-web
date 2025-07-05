import useSWRImmutable from "swr/immutable";
import { authedFetcher } from "@/api/base/swrFetcher";

const path = "/api/users/check-username";

interface CheckUsernameResponse {
  available: boolean;
  message: string;
}

export const useCheckUsername = (username: string) => {
  const { data, isLoading, error, mutate } =
    useSWRImmutable<CheckUsernameResponse>(
      `${path}?username=${username}`,
      authedFetcher
    );

  return {
    data: data,
    isLoading: isLoading,
    isError: error,
    mutate: mutate,
  };
};

export default useCheckUsername;
