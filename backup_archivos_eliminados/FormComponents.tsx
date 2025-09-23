// src/components/forms/FormComponents.tsx
import React, { ReactNode } from 'react';
import { useForm, UseFormReturn, FieldValues, Path, useController } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Card, ImageUpload, useToast } from '../common';
import { validate } from '../../utils';

// Form Provider Context
interface FormContextType<T extends FieldValues> {
  form: UseFormReturn<T>;
}

const FormContext = React.createContext<FormContextType<any> | undefined>(undefined);

export const useFormContext = <T extends FieldValues>() => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context as FormContextType<T>;
};

// Form Provider Component
interface FormProviderProps<T extends FieldValues> {
  children: ReactNode;
  defaultValues?: Partial<T>;
  onSubmit?: (data: T) => void;
  className?: string;
}

export function FormProvider<T extends FieldValues>({
  children,
  defaultValues,
  onSubmit,
  className = ''
}: FormProviderProps<T>) {
  const form = useForm<T>({
    defaultValues: defaultValues as any,
    mode: 'onChange' // Validación en tiempo real
  });

  const handleSubmit = form.handleSubmit((data: T) => {
    onSubmit?.(data);
  });

  return (
    <FormContext.Provider value={{ form }}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// Form Field Component
interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  children: (field: any) => ReactNode;
  rules?: object;
  description?: string;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  children,
  rules,
  description
}: FormFieldProps<T>) {
  const { form } = useFormContext<T>();
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control: form.control,
    rules
  });

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {children({ ...field, error: error?.message })}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error.message}
        </motion.p>
      )}
      
      {description && !error && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

// Input Field Component
interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  type?: 'text' | 'email' | 'url' | 'tel' | 'password';
  placeholder?: string;
  description?: string;
  rules?: object;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function InputField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  description,
  rules,
  leftIcon,
  rightIcon
}: InputFieldProps<T>) {
  // Validación automática basada en el tipo
  const getValidationRules = () => {
    const baseRules: any = { ...rules };
    
    if (type === 'email') {
      baseRules.validate = (value: string) => {
        if (!value) return true;
        return validate.email(value) || 'Email inválido';
      };
    }
    
    if (type === 'url') {
      baseRules.validate = (value: string) => {
        if (!value) return true;
        return validate.url(value) || 'URL inválida';
      };
    }
    
    return baseRules;
  };

  return (
    <FormField name={name} label={label} rules={getValidationRules()} description={description}>
      {({ value, onChange, onBlur, error }) => (
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            type={type}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`
              w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error 
                ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
      )}
    </FormField>
  );
}

// Textarea Field Component
interface TextareaFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  rules?: object;
  rows?: number;
  maxLength?: number;
}

export function TextareaField<T extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  rules,
  rows = 4,
  maxLength
}: TextareaFieldProps<T>) {
  const validationRules = {
    ...rules,
    ...(maxLength && {
      validate: (value: string) => {
        if (value && value.length > maxLength) {
          return `Máximo ${maxLength} caracteres`;
        }
        return true;
      }
    })
  };

  return (
    <FormField name={name} label={label} rules={validationRules} description={description}>
      {({ value, onChange, onBlur, error }) => (
        <div className="relative">
          <textarea
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            className={`
              w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200 resize-vertical
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${error 
                ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
          />
          
          {maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {(value || '').length}/{maxLength}
            </div>
          )}
        </div>
      )}
    </FormField>
  );
}

// Select Field Component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  rules?: object;
  options: SelectOption[];
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  placeholder = 'Seleccionar...',
  description,
  rules,
  options
}: SelectFieldProps<T>) {
  return (
    <FormField name={name} label={label} rules={rules} description={description}>
      {({ value, onChange, onBlur, error }) => (
        <select
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          className={`
            w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
          `}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}

// Image Upload Field Component
interface ImageUploadFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  rules?: object;
  placeholder?: string;
}

export function ImageUploadField<T extends FieldValues>({
  name,
  label,
  description,
  rules,
  placeholder = 'Subir imagen'
}: ImageUploadFieldProps<T>) {
  const { addToast } = useToast();

  return (
    <FormField name={name} label={label} rules={rules} description={description}>
      {({ value, onChange, error }) => (
        <ImageUpload
          value={value}
          onChange={onChange}
          onRemove={() => onChange('')}
          placeholder={placeholder}
          className={error ? 'border-red-300' : ''}
        />
      )}
    </FormField>
  );
}

// Form Section Component
interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  icon?: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  collapsible = false,
  defaultExpanded = true,
  icon
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <Card className="mb-6">
      <div 
        className={`flex items-center justify-between ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center space-x-3">
          {icon && <div className="text-blue-600">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        
        {collapsible && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            ▼
          </motion.div>
        )}
      </div>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="pt-4">
          {children}
        </div>
      </motion.div>
    </Card>
  );
};

// Submit Button Component
interface SubmitButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  className = ''
}) => {
  const { form } = useFormContext();
  const isFormValid = form.formState.isValid;

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
  };

  return (
    <motion.button
      type="submit"
      disabled={disabled || isLoading || !isFormValid}
      className={`
        px-6 py-3 rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Guardando...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};