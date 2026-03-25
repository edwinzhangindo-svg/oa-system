'use client'
import { signOut } from 'next-auth/react'
export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="w-full mt-1 text-xs text-gray-400 hover:text-red-500 transition-colors py-1.5 text-left px-3">
      退出登录
    </button>
  )
}
