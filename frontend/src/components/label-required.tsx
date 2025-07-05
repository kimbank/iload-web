"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"

interface LabelRequiredProps extends React.ComponentProps<typeof Label> {
  required?: boolean
}

export function LabelRequired({
  children,
  required = false,
  ...props
}: LabelRequiredProps) {
  return (
    <Label {...props}>
      {children}
      {required && <p className="text-red-500">*</p>}
    </Label>
  )
}

export default LabelRequired;
