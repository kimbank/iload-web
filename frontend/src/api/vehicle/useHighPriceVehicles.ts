import useSWRImmutable from "swr/immutable";
import { authedFetcher } from "@/api/base/swrFetcher";

const path = `/api/vehicle/high-price`;

interface HighPriceVehicleResponse {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const useHighPriceVehicles = () => {
  const { data, isLoading, error, mutate } =
    useSWRImmutable<HighPriceVehicleResponse>(`${path}`, authedFetcher);

  return {
    letterList: data,
    isLoading: isLoading,
    isError: error,
    mutate: mutate,
  };
};

export default useHighPriceVehicles;
