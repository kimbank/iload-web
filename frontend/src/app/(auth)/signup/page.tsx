"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postUsersSignup } from "@/api/postUsersSignup";
import { useCheckUsername } from "@/api/hooks/useCheckUsername";
import { CompleteAlertDialog } from "./complete-alert-dialog"; // Adjust the import path as necessary

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameToCheck, setUsernameToCheck] = useState("");
  const [completeAlertDialogOpen, setCompleteAlertDialogOpen] = useState(false);

  // 닉네임 중복 체크 (디바운싱)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username && formData.username.length >= 3) {
        setUsernameToCheck(formData.username);
      } else {
        setUsernameToCheck("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const { data: usernameCheck, isLoading: isCheckingUsername } =
    useCheckUsername(usernameToCheck);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (formData.username.length < 3) {
      setError("아이디는 3글자 이상이어야 합니다.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 6글자 이상이어야 합니다.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (isCheckingUsername) {
      setError("아이디 중복 확인을 기다려주세요.");
      return false;
    }

    if (usernameCheck && !usernameCheck.available) {
      setError("이미 사용 중인 아이디입니다.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await postUsersSignup({
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200 || response.status === 201) {
        setCompleteAlertDialogOpen(true);
      } else {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getUsernameStatus = () => {
    if (!formData.username) return null;
    if (formData.username.length < 3)
      return {
        color: "text-gray-500",
        message: "아이디는 3글자 이상이어야 합니다.",
      };
    if (isCheckingUsername)
      return { color: "text-gray-500", message: "중복 확인 중..." };
    if (usernameCheck?.available)
      return { color: "text-green-600", message: "사용 가능한 아이디입니다." };
    if (usernameCheck && !usernameCheck.available)
      return { color: "text-red-500", message: "이미 사용 중인 아이디입니다." };
    return null;
  };

  const usernameStatus = getUsernameStatus();
  const isFormValid =
    formData.username &&
    formData.password &&
    formData.confirmPassword &&
    formData.username.length >= 3 &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword &&
    usernameCheck?.available;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 회원가입 완료 모달 */}
      <CompleteAlertDialog
        isOpen={completeAlertDialogOpen}
      />
      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex items-center justify-center pt-14 px-6 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">회원가입</h1>
            <p className="text-gray-600">새 계정을 만들어보세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="아이디를 입력하세요 (3글자 이상)"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              {usernameStatus && (
                <p className={`text-xs ${usernameStatus.color}`}>
                  {usernameStatus.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요 (6글자 이상)"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isFormValid}
            >
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link
              href="/signin"
              className="text-black font-medium hover:underline"
            >
              로그인
            </Link>
          </div>
          <div className="text-center text-sm mt-2">
            <Link href="/" className="text-gray-600 hover:underline">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
