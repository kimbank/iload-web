import useSWRImmutable from "swr/immutable";
import { authedFetcher } from "@/api/base/swrFetcher";
import { components } from "@/api/openapi-schema";

const path = "/api/file/certificates";

export type VehicleRegistrationCertificateResponse = components["schemas"]["RegisteredVehicleFileSummaryResponse"];

export const useVehicleRegistrationCertificates = (vehicleId: number) => {
  const { data, isLoading, error, mutate } =
    useSWRImmutable<VehicleRegistrationCertificateResponse[]>(
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

export default useVehicleRegistrationCertificates;
