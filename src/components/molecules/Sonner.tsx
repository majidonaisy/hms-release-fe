"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          success: 'sonner-success-toast',
          error: 'sonner-error-toast',
          warning: 'sonner-warning-toast',
          info: 'sonner-info-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }