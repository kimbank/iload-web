import axios from 'axios';

export interface VehicleData {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  imageUrl?: string;
}

export interface VehicleListResponse {
  vehicles: VehicleData[];
  total: number;
}

// Axios 인스턴스 생성 (나중에 실제 API URL로 변경)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (인증 토큰 등 추가 가능)
api.interceptors.request.use(
  (config: any) => {
    // TODO: 인증 토큰이 있다면 헤더에 추가
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 등)
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // TODO: 에러 처리 로직 추가
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 최근 등록한 차량 목록 조회
 */
export async function getRecentAddedVehicles(): Promise<VehicleListResponse> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get('/vehicles/recent');
    // return response.data;

    // 현재는 Mock 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vehicles: [
            {
              id: "1",
              title: "현대 아반떼",
              subtitle: "2022년 · 2만km",
              price: "1,850 만원",
              imageUrl: undefined, // 나중에 실제 이미지 URL 추가
            },
            {
              id: "2",
              title: "기아 K5",
              subtitle: "2021년 · 3.5만km",
              price: "2,200 만원",
              imageUrl: undefined,
            },
          ],
          total: 2,
        });
      }, 800); // 로딩 시뮬레이션
    });
  } catch (error) {
    console.error('Failed to fetch recent vehicles:', error);
    throw error;
  }
}

/**
 * 높은 가격 차량 목록 조회
 */
export async function getHighPriceVehicles(): Promise<VehicleListResponse> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get('/vehicles/high-price');
    // return response.data;

    // 현재는 Mock 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vehicles: [
            {
              id: "3",
              title: "벤츠 E-Class",
              subtitle: "2023년 · 1만km",
              price: "6,500 만원",
              imageUrl: undefined,
            },
            {
              id: "4",
              title: "BMW 5시리즈",
              subtitle: "2022년 · 1.5만km",
              price: "5,800 만원",
              imageUrl: undefined,
            },
            {
              id: "5",
              title: "아우디 A6",
              subtitle: "2021년 · 2만km",
              price: "5,200 만원",
              imageUrl: undefined,
            },
            {
              id: "6",
              title: "렉서스 ES",
              subtitle: "2020년 · 3만km",
              price: "4,800 만원",
              imageUrl: undefined,
            },
          ],
          total: 4,
        });
      }, 800);
    });
  } catch (error) {
    console.error('Failed to fetch high price vehicles:', error);
    throw error;
  }
}

/**
 * 모든 차량 목록 조회
 */
export async function getAllVehicles(): Promise<VehicleListResponse> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get('/vehicles/all');
    // return response.data;
    // 현재는 Mock 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vehicles: [
            {
              id: "1",
              title: "현대 아반떼",
              subtitle: "2022년 · 2만km",
              price: "1,850 만원",
              imageUrl: undefined,
            },
            {
              id: "2",
              title: "기아 K5",
              subtitle: "2021년 · 3.5만km",
              price: "2,200 만원",
              imageUrl: undefined,
            },
            {
              id: "3",
              title: "벤츠 E-Class",
              subtitle: "2023년 · 1만km",
              price: "6,500 만원",
              imageUrl: undefined,
            },
            {
              id: "4",
              title: "BMW 5시리즈",
              subtitle: "2022년 · 1.5만km",
              price: "5,800 만원",
              imageUrl: undefined,
            },
          ],
          total: 4,
        });
      }, 800);
    });
  } catch (error) {
    console.error('Failed to fetch all vehicles:', error);
    throw error;
  }
}

/**
 * 무사고 차량 목록 조회
 */
export async function getAccidentFreeVehicles(): Promise<VehicleListResponse> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get('/vehicles/accident-free');
    // return response.data;

    // 현재는 Mock 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vehicles: [
            {
              id: "5",
              title: "토요타 캠리",
              subtitle: "2021년 · 2.8만km",
              price: "2,980 만원",
              imageUrl: undefined,
            },
            {
              id: "6",
              title: "혼다 어코드",
              subtitle: "2020년 · 4.2만km",
              price: "2,650 만원",
              imageUrl: undefined,
            },
            {
              id: "7",
              title: "포드 머스탱",
              subtitle: "2022년 · 1.2만km",
              price: "4,500 만원",
              imageUrl: undefined,
            },
            {
              id: "8",
              title: "쉐보레 말리부",
              subtitle: "2021년 · 3만km",
              price: "2,300 만원",
              imageUrl: undefined,
            }
          ],
          total: 4,
        });
      }, 800);
    });
  } catch (error) {
    console.error('Failed to fetch accident free vehicles:', error);
    throw error;
  }
}

/**
 * 무도색 차량 목록 조회
 */
export async function getPaintedFreeVehicles(): Promise<VehicleListResponse> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await api.get('/vehicles/painted-free');
    // return response.data;
    // 현재는 Mock 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vehicles: [
            {
              id: "7",
              title: "포드 머스탱",
              subtitle: "2022년 · 1.2만km",
              price: "4,500 만원",
              imageUrl: undefined,
            },
            {
              id: "8",
              title: "쉐보레 말리부",
              subtitle: "2021년 · 3만km",
              price: "2,300 만원",
              imageUrl: undefined,
            },
            {
              id: "9",
              title: "닛산 알티마",
              subtitle: "2020년 · 2.5만km",
              price: "2,100 만원",
              imageUrl: undefined,
            },
            {
              id: "10",
              title: "스바루 레거시",
              subtitle: "2019년 · 3.8만km",
              price: "2,400 만원",
              imageUrl: undefined,
            }
          ],
          total: 4,
        });
      }, 800);
    });
  } catch (error) {
    console.error('Failed to fetch painted free vehicles:', error);
    throw error;
  }
}