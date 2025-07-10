"use client";

import { useRouter } from "next/navigation";

export default function RegisterStep({
  id,
  step,
}: {
  id: number;
  step: number;
}) {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center mb-8">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 1
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-500 cursor-pointer"
          }`}
          onClick={() =>
            id && step !== 1 && router.push("/register/basic-info?id=" + id)
          }
        >
          1
        </div>
        <div className="w-24 h-px bg-gray-300"></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 2
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-500 cursor-pointer"
          }`}
          onClick={() =>
            id && step !== 2 && router.push("/register/etc-info?id=" + id)
          }
        >
          2
        </div>
        <div className="w-24 h-px bg-gray-300"></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 3
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-500 cursor-pointer"
          }`}
          onClick={() =>
            id && step !== 3 && router.push("/register/file-upload?id=" + id)
          }
        >
          3
        </div>
      </div>
    </div>
  );
}
