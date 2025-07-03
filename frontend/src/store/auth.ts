"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;

  refreshToken: string;
  setRefreshToken: (refreshToken: string) => void;

  isAuthenticated: boolean;

  username: string | null;
  setUsername: (username: string) => void;

  nickname: string | null;
  setNickname: (nickname: string) => void;

  signin: (
    accessToken: string,
    refreshToken: string,
    username: string,
    nickname: string
  ) => void;

  signout: () => void;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      accessToken: "",
      setAccessToken: (accessToken: string) => set({ accessToken }),

      refreshToken: "",
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),

      get isAuthenticated() {
        const { accessToken, refreshToken } = get();
        return !!accessToken && !!refreshToken;
      },

      username: null,
      setUsername: (username: string) => set({ username }),

      nickname: null,
      setNickname: (nickname: string) => set({ nickname }),

      signin: (
        accessToken: string,
        refreshToken: string,
        username: string,
        nickname: string
      ) => {
        set({
          accessToken,
          refreshToken,
          username,
          nickname,
        });
      },

      signout: () => {
        set({ accessToken: "", refreshToken: ""});
      },
    }),
    {
      name: "auth", // 저장소 이름
    }
  )
);

export default useAuthStore;
