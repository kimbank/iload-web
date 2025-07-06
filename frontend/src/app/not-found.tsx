"use client"

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center max-w-2xl min-w-xs">
      <div className="text-center space-y-6">
        {/* 404 아이콘/숫자 */}
        <div className="space-y-4">
          <span className="icon-[material-symbols--error-outline] text-8xl text-gray-400" />
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
        </div>

        {/* 메시지 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-600 text-base">
            요청하신 페이지가 존재하지 않거나
            <br />
            이동되었을 수 있습니다.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => router.push("/")}
            className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            홈으로 돌아가기
          </button>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
