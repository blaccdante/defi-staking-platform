import { useState, useCallback, useEffect } from 'react'

// Hook for handling mobile-optimized form validation
export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isValid, setIsValid] = useState(false)
  
  const validate = useCallback((fieldName, value) => {
    if (!validationSchema[fieldName]) return null
    
    const validator = validationSchema[fieldName]
    return validator(value)
  }, [validationSchema])
  
  const validateAll = useCallback(() => {
    const newErrors = {}
    let valid = true
    
    Object.keys(validationSchema).forEach(fieldName => {
      const error = validate(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        valid = false
      }
    })
    
    setErrors(newErrors)
    setIsValid(valid)
    return valid
  }, [validate, values, validationSchema])
  
  const setValue = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }))
    
    // Validate on change if field was already touched
    if (touched[fieldName]) {
      const error = validate(fieldName, value)
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }))
    }
  }, [validate, touched])
  
  const setTouched = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))
    
    // Validate when field is touched
    const error = validate(fieldName, values[fieldName])
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
  }, [validate, values])
  
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsValid(false)
  }, [initialValues])
  
  // Validate form on values change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(touched).length > 0) {
        validateAll()
      }
    }, 300) // Debounce validation
    
    return () => clearTimeout(timer)
  }, [values, validateAll, touched])
  
  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setTouched,
    validate: validateAll,
    reset
  }
}

// Hook for mobile keyboard handling
export const useMobileKeyboard = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  
  useEffect(() => {
    const initialHeight = window.innerHeight
    
    const handleResize = () => {
      const currentHeight = window.innerHeight
      const heightDifference = initialHeight - currentHeight
      
      // Detect keyboard if viewport height decreased by more than 150px
      const isKeyboardVisible = heightDifference > 150
      
      setKeyboardVisible(isKeyboardVisible)
      setViewportHeight(currentHeight)
    }
    
    const handleFocusIn = (e) => {
      if (e.target.matches('input, textarea, select')) {
        // Scroll element into view with offset for keyboard
        setTimeout(() => {
          e.target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          })
        }, 300)
      }
    }
    
    window.addEventListener('resize', handleResize)
    document.addEventListener('focusin', handleFocusIn)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [])
  
  return {
    keyboardVisible,
    viewportHeight,
    keyboardHeight: window.innerHeight - viewportHeight
  }
}

// Hook for form submission with loading states
export const useFormSubmission = (submitFunction) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const submit = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const result = await submitFunction(data)
      setSuccess(result?.message || 'Operation completed successfully')
      return result
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err.message || 'An error occurred. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [submitFunction])
  
  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setSuccess(null)
  }, [])
  
  return {
    submit,
    loading,
    error,
    success,
    reset
  }
}

// Common validation functions
export const validators = {
  required: (message = 'This field is required') => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message
    }
    return null
  },
  
  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Minimum ${min} characters required`
    }
    return null
  },
  
  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Maximum ${max} characters allowed`
    }
    return null
  },
  
  email: (message = 'Please enter a valid email address') => (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message
    }
    return null
  },
  
  number: (message = 'Please enter a valid number') => (value) => {
    if (value && (isNaN(parseFloat(value)) || !isFinite(value))) {
      return message
    }
    return null
  },
  
  positiveNumber: (message = 'Please enter a positive number') => (value) => {
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) <= 0)) {
      return message
    }
    return null
  },
  
  ethereumAddress: (message = 'Please enter a valid Ethereum address') => (value) => {
    if (value && !/^0x[a-fA-F0-9]{40}$/.test(value)) {
      return message
    }
    return null
  },
  
  // Combine multiple validators
  combine: (...validators) => (value) => {
    for (const validator of validators) {
      const error = validator(value)
      if (error) return error
    }
    return null
  }
}

// Hook for auto-save functionality
export const useAutoSave = (values, saveFunction, delay = 2000) => {
  const [lastSaved, setLastSaved] = useState(null)
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (values && Object.keys(values).some(key => values[key])) {
        setSaving(true)
        try {
          await saveFunction(values)
          setLastSaved(new Date())
        } catch (error) {
          console.error('Auto-save failed:', error)
        } finally {
          setSaving(false)
        }
      }
    }, delay)
    
    return () => clearTimeout(timer)
  }, [values, saveFunction, delay])
  
  return {
    lastSaved,
    saving
  }
}