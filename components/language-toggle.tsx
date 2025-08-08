'use client'
import { Button } from '@/components/ui/button'
import { Globe, Check } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
    router.push(newPath)
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
