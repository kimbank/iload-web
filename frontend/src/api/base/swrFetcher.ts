import { AuthedAxios } from "./axiosInstance";


export const authedFetcher = (path: string) => {
  return AuthedAxios.get(path).then((res) => res.data);
}

export default authedFetcher;
