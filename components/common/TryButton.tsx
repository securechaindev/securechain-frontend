'use client'
import { useRouter } from 'next/navigation'
import { STORAGE_KEYS } from '@/constants'
import { ArrowRight, Zap } from 'lucide-react'

interface TryButtonProps {
  locale: string
  buttonText: string
}

export function TryButton({ locale, buttonText }: TryButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)

    if (userEmail) {
      router.push(`/${locale}/home`)
    } else {
      router.push(`/${locale}/login`)
    }
  }

  return (
    <div className="relative group">
      {/* Glow effect background */}
      <div className="absolute -inset-1 bg-blue-800/30 rounded-lg blur-md opacity-30 group-hover:opacity-60 transition duration-300 animate-pulse"></div>

      {/* Main button */}
      <button
        onClick={handleClick}
        className="
          relative px-8 py-3 bg-blue-900 text-white font-medium text-base
          hover:bg-blue-800 transform hover:scale-[1.02]
          transition-all duration-200 ease-out shadow-lg hover:shadow-xl
          w-full sm:w-auto tracking-wide rounded-md
          border border-blue-700/30 hover:border-blue-600/50
          hover:shadow-blue-800/25
          flex items-center justify-center gap-2
          animate-pulse hover:animate-none
          [animation-duration:2s]
        "
      >
        <Zap className="h-4 w-4 opacity-90" />
        <span className="font-medium">{buttonText}</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-all duration-200" />
      </button>
    </div>
  )
}
