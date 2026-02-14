import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
  fullWidth?: boolean;
  rows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      maxLength,
      showCount = false,
      fullWidth = true,
      className = '',
      rows = 4,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          maxLength={maxLength}
          value={value}
          className={`
            w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400
            transition-all duration-200 resize-vertical
            focus:outline-none focus:ring-2
            hover:border-gray-400
            ${hasError 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-200' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
            }
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {hasError ? (
            <p id={`${inputId}-error`} className="text-sm text-error-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          ) : helperText ? (
            <p id={`${inputId}-helper`} className="text-sm text-gray-500">
              {helperText}
            </p>
          ) : (
            <span />
          )}
          {showCount && maxLength && (
            <p className={`text-sm ${currentLength >= maxLength ? 'text-error-500' : 'text-gray-400'}`}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
export type { TextAreaProps };
