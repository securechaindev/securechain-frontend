interface AuthLoadingProps {
  message?: string
}

export function AuthLoading({ message = 'Verifying authentication...' }: AuthLoadingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span>{message}</span>
      </div>
    </div>
  )
}
