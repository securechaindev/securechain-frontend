'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'

interface TryButtonProps {
  locale: string
  buttonText: string
}

export function TryButton({ locale, buttonText }: TryButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
    const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)

    if (userId && userEmail) {
      router.push(`/${locale}/home`)
    } else {
      router.push(`/${locale}/login`)
    }
  }

  return (
    <Button size="lg" onClick={handleClick}>
      {buttonText}
    </Button>
  )
}
