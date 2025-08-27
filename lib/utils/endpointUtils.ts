export const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700'
    case 'POST':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700'
    case 'PUT':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700'
    case 'PATCH':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700'
    case 'DELETE':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700'
  }
}

export const nodeTypes = [
  'RubyGemsPackage',
  'CargoPackage',
  'NuGetPackage',
  'PyPIPackage',
  'NPMPackage',
  'MavenPackage',
]
