import useSWRImmutable from "swr/immutable";
import { authedFetcher } from "@/api/base/swrFetcher";
import { components } from "@/api/openapi-schema";

const path = "/api/file/photos";

export type VehiclePhotoResponse = components["schemas"]["RegisteredVehicleFileSummaryResponse"];

export const useVehiclePhotos = (vehicleId: number) => {
  const { data, isLoading, error, mutate } =
    useSWRImmutable<VehiclePhotoResponse[]>(
      vehicleId ? `${path}?vehicleId=${vehicleId}` : null,
      authedFetcher
    );

  return {
    data: data || [],
    isLoading: isLoading,
    isError: error,
    mutate: mutate,
  };
};

export default useVehiclePhotos;
