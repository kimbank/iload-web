import useSWRInfinite from "swr/infinite";
import { authedFetcher } from "@/api/base/swrFetcher";

const basePath = "/api/main/registered-vehicles";

interface RegisteredVehiclesParams {
  noAccident?: boolean;
  noPaint?: boolean;
  size?: number;
}

export const usePageRegisteredVehicles = (params: RegisteredVehiclesParams = {}) => {
  const { noAccident = false, noPaint = false, size = 4 } = params;

  const getKey = (pageIndex: number, previousPageData: any) => {
    // 이전 페이지 데이터가 있고, 마지막 페이지라면 null을 반환하여 더 이상 요청하지 않음
    if (previousPageData && previousPageData.last) return null;
    
    // 첫 번째 페이지이거나 다음 페이지가 있을 때의 key 생성
    const queryParams = new URLSearchParams({
      noAccident: noAccident.toString(),
      noPaint: noPaint.toString(),
      page: pageIndex.toString(),
      size: size.toString(),
    });
    
    return `${basePath}?${queryParams.toString()}`;
  };

  const { data, error, isLoading, isValidating, mutate, size: currentSize, setSize } = useSWRInfinite(
    getKey,
    authedFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
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

export default usePageRegisteredVehicles;


/**
  # GET
  curl -X 'GET' \
  'http://localhost:8080/api/main/registered-vehicles?noAccident=false&noPaint=false&page=0&size=10'

  # Response:

  {
  "content": [
    {
      "id": 8,
      "usersId": 1,
      "username": "bank",
      "manufacturer": null,
      "releaseYear": null,
      "mileage": null,
      "price": null,
      "photos": [
        {
          "url": null
        }
      ],
      "createdAt": "2025-07-06T16:21:30.150418Z",
      "updatedAt": "2025-07-06T16:21:30.150423Z"
    },
    {
      "id": 7,
      "usersId": 2,
      "username": "neojin0227",
      "manufacturer": "KIA",
      "releaseYear": 2023,
      "mileage": 60000,
      "price": null,
      "photos": [
        {
          "url": null
        }
      ],
      "createdAt": "2025-07-06T16:19:02.383510Z",
      "updatedAt": "2025-07-06T16:21:00.151525Z"
    },
    {
      "id": 6,
      "usersId": 1,
      "username": "bank",
      "manufacturer": "KIA",
      "releaseYear": 2010,
      "mileage": 2222,
      "price": null,
      "photos": [
        {
          "url": null
        }
      ],
      "createdAt": "2025-07-06T13:57:43.560098Z",
      "updatedAt": "2025-07-06T16:22:43.865257Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "last": true,
  "totalElements": 3,
  "totalPages": 1,
  "first": true,
  "size": 10,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 3,
  "empty": false
}
 */