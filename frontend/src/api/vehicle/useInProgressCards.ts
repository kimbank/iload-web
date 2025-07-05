import useSWR from "swr";
import { authedFetcher } from "@/api/base/swrFetcher";
import { components } from "@/api/openapi-schema";

const path = "/api/vehicle/in-progress-cards";

export interface RegisterVehicleInProgressCardResponse {
  id: number;
  username: string;
  progressStep: number;
  progressTotalSteps: number;
  manufacturer: string;
  releaseYear: number;
  mileage: number;
  price: number;
  createdAt: string; // or Date
  updatedAt: string; // or Date
}

export const useInProgressCards = () => {
  const { data, isLoading, error, mutate } = useSWR<
    components["schemas"]["RegisterVehicleInProgressCardResponse"][]
  >(path, authedFetcher);

  return {
    data: data,
    isLoading: isLoading,
    isError: error,
    mutate: mutate,
  };
};

export default useInProgressCards;
