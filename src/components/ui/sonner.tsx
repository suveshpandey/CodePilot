"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#fecaca",
          "--normal-text": "#2d3748",
          "--normal-border": "#EF5350",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
