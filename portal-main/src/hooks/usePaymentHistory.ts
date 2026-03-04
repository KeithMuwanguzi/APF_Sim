import { useState, useEffect } from 'react'
import { Transaction, Receipt } from '../types/payment'
import { getPaymentHistory, getRecentTransactions, getReceipts } from '../services/payments.service'

/**
 * Hook for payment history management
 * Fetches transactions and receipts from the backend
 */
export const usePaymentHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [transactionsData, receiptsData] = await Promise.all([
          getPaymentHistory(),
          getReceipts()
        ])
        
        setTransactions(transactionsData || [])
        setReceipts(receiptsData || [])
      } catch (err) {
        setError('Failed to load payment history')
        console.error('Payment history error:', err)
        setTransactions([])
        setReceipts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    transactions,
    receipts,
    loading,
    error
  }
}

/**
 * Hook for recent transactions
 * @param limit - Number of recent transactions to fetch
 */
export const useRecentTransactions = (limit: number = 3) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getRecentTransactions(limit)
      setTransactions(data || [])
    } catch (err) {
      setError('Failed to load recent transactions')
      console.error('Recent transactions error:', err)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [limit])

  return {
    transactions,
    loading,
    error,
    refetch: fetchData
  }
}

/**
 * Hook for receipts and invoices
 * Fetches all available receipts from backend
 */
export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getReceipts()
        setReceipts(data || [])
      } catch (err) {
        setError('Failed to load receipts')
        console.error('Receipts error:', err)
        setReceipts([])
      } finally {
        setLoading(false)
      }
    }

    fetchReceipts()
  }, [])

  return {
    receipts,
    loading,
    error
  }
}
