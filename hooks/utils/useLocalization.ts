'use client'
import { useState } from 'react'

export function useLocalization(locale: 'en' | 'es', translations: Record<string, any>) {
  const [currentLocale, setCurrentLocale] = useState<'en' | 'es'>(locale)
  const [currentTranslations, setCurrentTranslations] = useState(translations)

  const handleLocaleChange = async (newLocale: 'en' | 'es') => {
    try {
      // Import getDictionary dynamically to avoid circular dependencies
      const { getDictionary } = await import('@/lib/i18n')
      const newTranslations = await getDictionary(newLocale)
      setCurrentLocale(newLocale)
      setCurrentTranslations(newTranslations)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  return {
    currentLocale,
    currentTranslations,
    handleLocaleChange
  }
}
