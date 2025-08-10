import { notFound } from 'next/navigation'

const dictionaries = {
  en: () => import('@/public/locales/en/common.json').then(module => module.default),
  es: () => import('@/public/locales/es/common.json').then(module => module.default),
}

export const getDictionary = async (locale: 'en' | 'es') => {
  if (!dictionaries[locale]) {
    notFound()
  }
  return dictionaries[locale]()
}

export type Locale = 'en' | 'es'
export const locales: Locale[] = ['en', 'es']
export const defaultLocale: Locale = 'es'
