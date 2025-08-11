import { readFile } from 'fs/promises'
import path from 'path'
import { HomePageClient } from '@/components/feature/dashboard'

interface HomePageProps {
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

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const translations = await getTranslations(locale)

  return <HomePageClient locale={locale} translations={translations} />
}
