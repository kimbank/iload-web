"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 z-50 w-full max-w-2xl min-w-xs bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-15">
        <Link href="/" className="flex flex-col items-center">
          {pathname === '/' ? (
            <span className="icon-[material-symbols--home-rounded] text-2xl text-black" />
          ) : (
            <span className="icon-[material-symbols--home-outline-rounded] text-2xl text-gray-600" />
          )}
          <span className={`text-base font-medium ${pathname === '/' ? 'text-black' : 'text-gray-600'}`}>홈</span>
        </Link>
        <Link href="/price" className="flex flex-col items-center">
          {pathname.startsWith('/price') ? (
            <span className="icon-[mingcute--stock-fill] text-2xl text-black" />
          ) : (
            <span className="icon-[mingcute--stock-line] text-2xl text-gray-600" />
          )}
          <span className={`text-base font-medium ${pathname.startsWith('/price') ? 'text-black' : 'text-gray-600'}`}>시세 조회</span>
        </Link>
        <Link href="/register" className="flex flex-col items-center">
          {pathname.startsWith('/register') ? (
            <span className="icon-[tabler--copy-plus-filled] text-2xl text-black" />
          ) : (
            <span className="icon-[tabler--copy-plus] text-2xl text-gray-600" />
          )}
          <span className={`text-base font-medium ${pathname.startsWith('/register') ? 'text-black' : 'text-gray-600'}`}>차량 등록</span>
        </Link>
        <Link href="/mycar" className="flex flex-col items-center">
          {pathname.startsWith('/mycar') ? (
            <span className="icon-[mingcute--car-fill] text-2xl text-black" />
          ) : (
            <span className="icon-[mingcute--car-line] text-2xl text-gray-600" />
          )}
          <span className={`text-base font-medium ${pathname.startsWith('/mycar') ? 'text-black' : 'text-gray-600'}`}>내 차량</span>
        </Link>
      </div>
    </div>
  )
}
