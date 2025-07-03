'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/store/auth";
import { postAuthSignout } from "@/api/postAuthSignout";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { signout, accessToken, refreshToken, username } = useAuthStore();
  const router = useRouter();

  const handleSignout = async () => {
    try {
      await postAuthSignout({ accessToken, refreshToken });
    } catch (error) {
      console.error("Failed to sign out from server", error);
    } finally {
      setTimeout(() => {
        signout();
      }, 200);
      router.push("/");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-lg">{username || "(알수없음)"} 님</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="text-sm" variant="link">로그아웃</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>로그아웃 하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignout}>로그아웃</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
