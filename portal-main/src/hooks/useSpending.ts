import { useState, useEffect } from 'react'
import { getSpendingOverview, SpendingOverview } from '../services/spending.service'

/**
 * Custom hook for spending overview data
 * Fetches spending data from backend API
 */
export const useSpendingOverview = () => {
  const [data, setData] = useState<SpendingOverview>({
    totalSpent: 0,
    breakdown: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpending = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const spendingData = await getSpendingOverview()
        setData(spendingData)
      } catch (err) {
        setError('Failed to load spending data')
        console.error('Spending error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSpending()
  }, [])

  return {
    data,
    loading,
    error
  }
}
