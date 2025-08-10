'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { STORAGE_KEYS } from '@/constants'

interface TryButtonProps {
  locale: string
  buttonText: string
}

export function TryButton({ locale, buttonText }: TryButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    // Simple check for existing session
    const token = localStorage.getItem('access_token')
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
    const userEmail = localStorage.getItem('user_email')

    if (token && userId && userEmail) {
      // If has session data, go directly to home
      router.push(`/${locale}/home`)
    } else {
      // If no session, go to login
      router.push(`/${locale}/login`)
    }
  }

  return (
    <Button size="lg" onClick={handleClick}>
      {buttonText}
    </Button>
  )
}
