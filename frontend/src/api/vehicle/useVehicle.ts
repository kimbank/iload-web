import useSWRImmutable from "swr/immutable";
import { authedFetcher } from "@/api/base/swrFetcher";
import { ServerVehicleData } from "@/api/vehicle/form/vehicle-schema";

const path = "/api/vehicle";

export const useVehicle = (id: number) => {
  const { data, isLoading, error, mutate } = useSWRImmutable<
    ServerVehicleData
  >(`${path}?id=${id}`, authedFetcher);

  return {
    data: data,
    isLoading: isLoading,
    isError: error,
    mutate: mutate,
  };
};

export default useVehicle;
