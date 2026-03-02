/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Get the current date formatted as a readable string
 * @returns Current date in format "Month DD, YYYY"
 */
export const getCurrentDateFormatted = (): string => {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get the current date and time formatted as a readable string
 * @returns Current date and time in format "Month DD, YYYY at HH:MM AM/PM"
 */
export const getCurrentDateTimeFormatted = (): string => {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  return `${date} at ${time}`
}

/**
 * Get a formatted date string for a specific date
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get the current date in ISO format (YYYY-MM-DD)
 * @returns Current date in ISO format
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get a greeting based on the current time
 * @returns Time-based greeting
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours()
  
  if (hour < 12) {
    return 'Good Morning'
  } else if (hour < 17) {
    return 'Good Afternoon'
  } else {
    return 'Good Evening'
  }
}