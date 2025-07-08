"use client";

import AppBar from "@/components/app-bar";
import BottomNavigation from "@/components/bottom-navigation";
import useAuthStore from "@/store/auth";
import { AuthAlertDialog } from "@/components/auth-alert-dialog";
import UserProfile from "./user-profile";

export default function MyCar() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <AuthAlertDialog />;
  }

  return (
    <div className="min-h-screen">
      <AppBar />

      <main className="flex-col justify-center items-center pt-14 pb-20 px-4">
        <UserProfile />
      </main>

      <BottomNavigation />
    </div>
  );
}
