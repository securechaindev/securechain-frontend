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
}

export function LanguageToggle({ currentLang }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (value: string) => {
    const newLang = value as 'en' | 'es'
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
    const newPath = `/${newLang}${pathWithoutLocale}`

    // Preserve URL hash and search params
    const currentUrl = new URL(window.location.href)
    const search = currentUrl.search
    const hash = currentUrl.hash

    router.push(`${newPath}${search}${hash}`)
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
