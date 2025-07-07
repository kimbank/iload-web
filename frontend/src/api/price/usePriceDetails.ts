import useSWR from "swr";
import { authedFetcher } from "@/api/base/swrFetcher";
import { components } from "@/api/openapi-schema";

const path = "/api/price/details";

export const usePriceDetails = (vehicleId: number | null) => {
  const { data, isLoading, error, mutate } = useSWR<
    components["schemas"]["PriceDetailResponse"]
  >(
    vehicleId ? `${path}?vehicleId=${vehicleId}` : null,
    authedFetcher
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export default usePriceDetails;
