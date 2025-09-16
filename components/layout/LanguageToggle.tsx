'use client'
import { Globe, Check } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui'

interface LanguageToggleProps {
  currentLang: 'en' | 'es'
  onLanguageChange?: (_locale: 'en' | 'es') => void
}

export function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (value: string) => {
    const newLang = value as 'en' | 'es'

    if (onLanguageChange) {
      onLanguageChange(newLang)
      return
    }

    const currentScrollY = window.scrollY

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
    const newPath = `/${newLang}${pathWithoutLocale}`

    const currentUrl = new URL(window.location.href)
    const search = currentUrl.search
    const hash = currentUrl.hash

    router.push(`${newPath}${search}${hash}`, { scroll: false })

    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      setTimeout(() => {
        window.scrollTo(0, currentScrollY)
      }, 100)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="px-3">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuRadioGroup value={currentLang} onValueChange={handleLanguageChange}>
          <DropdownMenuRadioItem
            value="en"
            className="flex items-center justify-between relative [&>span]:hidden"
          >
            English
            {currentLang === 'en' && <Check className="h-4 w-4" />}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="es"
            className="flex items-center justify-between relative [&>span]:hidden"
          >
            Español
            {currentLang === 'es' && <Check className="h-4 w-4" />}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
