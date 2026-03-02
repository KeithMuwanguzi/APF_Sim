/**
 * Spending service - handles all spending-related API calls
 * Currently returns empty data - will be connected to backend API
 */

export interface SpendingData {
  year: string
  amount: number
  formattedAmount: string
}

export interface SpendingOverview {
  totalSpent: number
  breakdown: SpendingData[]
}

/**
 * Get spending overview data
 * @returns Promise with spending overview
 */
export const getSpendingOverview = async (): Promise<SpendingOverview> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/spending/overview`)
  // return response.json()
  
  return {
    totalSpent: 0,
    breakdown: []
  }
}

/**
 * Get spending by year
 * @param _year - Year to get spending for
 * @returns Promise with spending data
 */
export const getSpendingByYear = async (_year: string): Promise<SpendingData | null> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/spending/year/${_year}`)
  // return response.json()
  
  return null
}

/**
 * Get spending trend (last N years)
 * @param _years - Number of years to fetch
 * @returns Promise with spending trend data
 */
export const getSpendingTrend = async (_years: number = 5): Promise<SpendingData[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/spending/trend?years=${_years}`)
  // return response.json()
  
  return []
}
