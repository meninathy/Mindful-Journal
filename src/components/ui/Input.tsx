import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-heading font-semibold text-mindful-dark/70 mb-1.5">{label}</label>}
      <input className={`input-field ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-500 font-body">{error}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-heading font-semibold text-mindful-dark/70 mb-1.5">{label}</label>}
      <textarea className={`input-field resize-none ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-500 font-body">{error}</p>}
    </div>
  )
}
