'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

interface MobileNavProps {
  currentLang: 'en' | 'es'
  locale: 'en' | 'es'
  translations: {
    loginButton: string
    openApiDocsButton: string
    toolsTitle: string
    howTheyWorkTitle: string
    useCasesTitle: string
    supportersTitle: string
    documentationLink: string
  }
}

export function MobileNav({ locale, translations: t }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <a
            href={`/${locale}/home`}
            className="block px-2 py-1 text-lg hover:text-primary"
            onClick={() => setOpen(false)}
          >
            {t.loginButton}
          </a>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-2 py-1 text-lg hover:text-primary"
            onClick={() => setOpen(false)}
          >
            {t.openApiDocsButton}
          </a>
          <a
            href="#tools"
            className="block px-2 py-1 text-lg hover:text-primary"
            onClick={() => setOpen(false)}
          >
            {t.toolsTitle}
          </a>
          <a
            href="#comparison"
            className="block px-2 py-1 text-lg hover:text-primary"
            onClick={() => setOpen(false)}
          >
            {t.howTheyWorkTitle}
          </a>
          <a
            href="#use-cases"
            className="block px-2 py-1 text-lg hover:text-primary"
            onClick={() => setOpen(false)}
          >
            {t.useCasesTitle}
          </a>
          <a
            href="#supporters"
            className="block px-2 py-1 text-lg hover:text-primary"
            onClick={() => setOpen(false)}
          >
            {t.supportersTitle}
          </a>
          <a
            href="https://securechaindev.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-2 py-1 text-lg hover:text-primary"
            onClick={() => setOpen(false)}
          >
            {t.documentationLink}
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
