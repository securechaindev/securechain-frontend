import { readFile } from 'fs/promises'
import path from 'path'
import LoginPageClient from '@/components/login-page-client'

interface LoginPageProps {
  params: Promise<{
    locale: 'en' | 'es'
  }>
}

async function getTranslations(locale: 'en' | 'es') {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'common.json')
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error loading translations:', error)
    const fallbackPath = path.join(process.cwd(), 'public', 'locales', 'en', 'common.json')
    const fallbackContent = await readFile(fallbackPath, 'utf-8')
    return JSON.parse(fallbackContent)
  }
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params
  const translations = await getTranslations(locale)

  return <LoginPageClient locale={locale} translations={translations} />
}
