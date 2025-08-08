module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },
  // Esto es importante para el desarrollo para recargar las traducciones al cambiar
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
