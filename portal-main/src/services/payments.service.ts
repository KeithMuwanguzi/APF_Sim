/**
 * Payment service - handles payment history and receipt API calls
 * Connected to backend API: GET /api/v1/payments/history/
 */

import { Transaction, Receipt } from '../types/payment'
import { getAccessToken } from '../utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Helper to build authorized headers
 */
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/**
 * Map a backend payment record to the frontend Transaction type
 */
const mapPaymentToTransaction = (payment: any): Transaction => {
  const providerLabel = payment.provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'
  // Force UGX currency regardless of what backend returns
  const currency = 'UGX'
  return {
    date: payment.created_at,
    type: 'Membership Fee',
    reference: payment.transaction_reference,
    amount: `${currency} ${Number(payment.amount).toLocaleString()}`,
    method: providerLabel,
    methodIcon: null,
    status: payment.status,
    description: payment.status === 'completed'
      ? `Payment completed via ${providerLabel}`
      : payment.error_message || `Payment ${payment.status}`,
  }
}

/**
 * Get payment history/transactions
 * @returns Promise with array of transactions
 */
export const getPaymentHistory = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch payment history: ${response.status}`)
      return []
    }

    const data = await response.json()
    return (data.results || []).map(mapPaymentToTransaction)
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return []
  }
}

/**
 * Get recent transactions (last N transactions)
 * @param limit - Number of recent transactions to fetch
 * @returns Promise with array of recent transactions
 */
export const getRecentTransactions = async (limit: number = 3): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch recent transactions: ${response.status}`)
      return []
    }

    const data = await response.json()
    return (data.results || []).map(mapPaymentToTransaction)
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return []
  }
}

/**
 * Get all receipts and invoices
 * @returns Promise with array of receipts
 */
export const getReceipts = async (): Promise<Receipt[]> => {
  try {
    // Derive receipts from completed payments
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/?status=completed`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error(`Failed to fetch receipts: ${response.status}`)
      return []
    }

    const data = await response.json()
    // Force UGX currency
    return (data.results || []).map((payment: any): Receipt => ({
      id: payment.id,
      title: 'Membership Fee Payment',
      date: payment.completed_at || payment.created_at,
      amount: `UGX ${Number(payment.amount).toLocaleString()}`,
      type: 'receipt',
      reference: payment.transaction_reference,
    }))
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return []
  }
}

/**
 * Filter transactions based on criteria
 * @param _dateRange - Date range filter
 * @param _paymentType - Payment type filter
 * @param status - Status filter
 * @returns Promise with filtered transactions
 */
export const filterTransactions = async (
  _dateRange: string,
  _paymentType: string,
  status: string
): Promise<Transaction[]> => {
  const params = new URLSearchParams()
  if (status && status !== 'all') {
    params.append('status', status)
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/history/?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to filter transactions: ${response.status}`)
  }

  const data = await response.json()
  return (data.results || []).map(mapPaymentToTransaction)
}

/**
 * Process a payment
 * @param paymentData - Payment information
 * @returns Promise with payment result
 */
export const processPayment = async (paymentData: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/payments/initiate/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `Payment failed: ${response.status}`)
  }

  return response.json()
}
