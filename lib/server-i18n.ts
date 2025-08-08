import fs from 'fs'
import path from 'path'
import { NextRequest } from 'next/server'

const translationCache = new Map<string, any>()

export function getServerTranslations(language: string = 'en') {
  if (translationCache.has(language)) {
    return translationCache.get(language)
  }

  try {
    const translationsPath = path.join(process.cwd(), 'public', 'locales', language, 'common.json')

    const translationsContent = fs.readFileSync(translationsPath, 'utf8')
    const translations = JSON.parse(translationsContent)

    translationCache.set(language, translations)

    return translations
  } catch (error) {
    if (language !== 'en') {
      return getServerTranslations('en')
    }

    console.error('Error loading translations:', error)
    return {}
  }
}

export function getTranslation(translations: any, key: string): string {
  return key.split('.').reduce((obj, k) => obj?.[k], translations) || key
}

export function getApiTranslations(request: NextRequest): { t: any; lang: string } {
  let language = 'en'

  try {
    const acceptLanguage = request.headers.get('accept-language')
    if (acceptLanguage) {
      const preferredLang = acceptLanguage.split(',')[0].split('-')[0]
      if (preferredLang === 'es' || preferredLang === 'en') {
        language = preferredLang
      }
    }

    const pathname = request.nextUrl.pathname
    if (pathname.startsWith('/es/')) {
      language = 'es'
    } else if (pathname.startsWith('/en/')) {
      language = 'en'
    }

    const langParam = request.nextUrl.searchParams.get('lang')
    if (langParam && (langParam === 'en' || langParam === 'es')) {
      language = langParam
    }
  } catch (error) {
    console.warn('Error detecting language from request:', error)
    language = 'en'
  }

  const translations = getServerTranslations(language)

  return {
    t: translations,
    lang: language,
  }
}

export async function getApiTranslationsFromBody(
  request: NextRequest
): Promise<{ t: any; lang: string }> {
  let language = 'en'

  try {
    const { lang: detectedLang } = getApiTranslations(request)
    language = detectedLang

    try {
      const body = await request.clone().json()
      if (body.language && (body.language === 'en' || body.language === 'es')) {
        language = body.language
      }
    } catch {
        language = 'en'
    }
  } catch {
    language = 'en'
  }

  const translations = getServerTranslations(language)

  return {
    t: translations,
    lang: language,
  }
}
