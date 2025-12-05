import axios, {type AxiosRequestConfig} from "axios";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  path?: string;
  statusCode?: number;
}

const AUTH_TOKEN = `
eyJhbGciOiJIUzM4NCJ9.eyJpc3MiOiJjb3N5LWJhY2tlbmQiLCJ0b2tlblR5cGUiOiJJREVOVElUWV9UT0tFTiIsInJvbGUiOiJPV05FUiIsInVzZXJuYW1lIjoiYWRtaW4iLCJzdWIiOiJmZWYxMDlhZi1mNmMzLTRhNDMtOTk1NC1kZDhjNDAxNzg5MjgiLCJpYXQiOjE3NjQ5NzYyNjAsImV4cCI6MTc2NDk3OTg2MH0.DhAwZJU54vvy1qeUIRYQUy4VOM35OshWIIDSR3vKQmPynUH-DcKK1DPxfxL5yXc_
`.replace("\n", "");

export const AXIOS_INSTANCE = axios.create({
  baseURL: "/api",
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined && "success" in response.data) {
      const apiResponse: ApiResponse<unknown> = response.data;
      return apiResponse.data;
    }

    return response.data;
  },
  (error) => {
    // Handle errors globally if you wish
    return Promise.reject(error);
  },
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
    timeout: options?.timeout ?? 4000,
    headers: {"Authorization": `Bearer ${AUTH_TOKEN}`}
  }).then((response) => response as T);

  // @ts-expect-error
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
