import React from 'react'
import { Button } from './ui/button'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <ErrorBoundaryReset />
        </div>
      )
    }

    return this.props.children
  }
}

function ErrorBoundaryReset() {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <Button
      onClick={() => {
        reset()
        window.location.reload()
      }}
    >
      Try again
    </Button>
  )
}
