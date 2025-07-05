import { useSWRConfig } from "swr";

export const swrCacheClear = () => {
  const { mutate } = useSWRConfig();

  const clearCache = () => {
    // 모든 SWR 캐시 비우기
    mutate(
      key => true,
      undefined,
      { revalidate: false }
    );
  };

  return { clearCache };
}

export default swrCacheClear;
