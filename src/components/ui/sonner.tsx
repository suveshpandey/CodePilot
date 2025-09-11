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
          "--normal-bg": "#1e293b",    // slate-800
          "--normal-text": "#cbd5e1",  // slate-300
          "--normal-border": "#334155", // slate-700
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }