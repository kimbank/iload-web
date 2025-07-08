import useSWRInfinite from "swr/infinite";
import { authedFetcher } from "@/api/base/swrFetcher";

const basePath = "/api/vehicle/my";

interface MyVehiclesParams {
  size?: number;
}

export const useMyVehicles = (params: MyVehiclesParams = {}) => {
  const { size = 4 } = params;

  const getKey = (pageIndex: number, previousPageData: any) => {
    // 이전 페이지 데이터가 있고, 마지막 페이지라면 null을 반환하여 더 이상 요청하지 않음
    if (previousPageData && previousPageData.last) return null;
    
    // 첫 번째 페이지이거나 다음 페이지가 있을 때의 key 생성
    const queryParams = new URLSearchParams({
      page: pageIndex.toString(),
      size: size.toString(),
    });
    
    return `${basePath}?${queryParams.toString()}`;
  };

  const { data, error, isLoading, isValidating, mutate, size: currentSize, setSize } = useSWRInfinite(
    getKey,
    authedFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  // 모든 페이지의 content를 하나의 배열로 합치기
  const vehicles = data ? data.flatMap(page => page.content) : [];
  
  // 마지막 페이지인지 확인
  const isReachingEnd = data && data[data.length - 1]?.last;
  
  // 더 로드할 수 있는지 확인
  const canLoadMore = !isReachingEnd && !error;

  // 다음 페이지 로드
  const loadMore = () => {
    if (canLoadMore) {
      setSize(currentSize + 1);
    }
  };

  return {
    vehicles,
    data: data,
    isLoading: isLoading,
    isValidating: isValidating,
    isError: error,
    canLoadMore,
    loadMore,
    mutate: mutate,
  };
};

export default useMyVehicles;
