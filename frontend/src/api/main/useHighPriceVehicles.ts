import useSWR from "swr";
import { authedFetcher } from "@/api/base/swrFetcher";
import { components } from "@/api/openapi-schema";

const path = "/api/main/high-price-vehicles";

export const useVehicle = () => {
  const { data, isLoading, error, mutate } = useSWR<
    components["schemas"]["RegisteredVehicleCardResponse"][]
  >(`${path}`, authedFetcher);

  return {
    data: data,
    isLoading: isLoading,
    isError: error,
    mutate: mutate,
  };
};

export default useVehicle;
