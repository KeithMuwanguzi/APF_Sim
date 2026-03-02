import { Smartphone, Wallet, Building2 } from 'lucide-react'

export interface Transaction {
  date: string
  type: string
  reference: string
  amount: string
  method: string
  methodIcon: any
  status: string
  description: string
}

export interface Receipt {
  id: string
  title: string
  date: string
  amount: string
  type: 'invoice' | 'receipt'
  reference: string
}

/**
 * Shared transaction data service
 * Provides consistent transaction data across the application
 */
export class TransactionDataService {
  
  /**
   * Get all transactions (full history)
   */
  static getAllTransactions(): Transaction[] {
    return [
      {
        date: '2023-11-20',
        type: 'Annual Subscription',
        reference: 'APF-SUB-23-001',
        amount: 'UGX 150,000',
        method: 'MTN Mobile Money',
        methodIcon: Smartphone,
        status: 'Completed',
        description: 'Annual membership subscription for 2023-2024',
      },
      {
        date: '2023-01-15',
        type: 'Application Fee',
        reference: 'APF-APP-23-005',
        amount: 'UGX 50,000',
        method: 'DFCU Bank',
        methodIcon: Building2,
        status: 'Completed',
        description: 'Membership application processing fee',
      },
      {
        date: '2022-11-20',
        type: 'Annual Subscription',
        reference: 'APF-SUB-22-001',
        amount: 'UGX 150,000',
        method: 'Airtel Money',
        methodIcon: Wallet,
        status: 'Completed',
        description: 'Annual membership subscription for 2022-2023',
      },
      {
        date: '2022-06-01',
        type: 'Donation',
        reference: 'APF-DON-22-010',
        amount: 'UGX 100,000',
        method: 'MTN Mobile Money',
        methodIcon: Smartphone,
        status: 'Completed',
        description: 'Voluntary contribution to APF development fund',
      },
      {
        date: '2021-11-20',
        type: 'Annual Subscription',
        reference: 'APF-SUB-21-001',
        amount: 'UGX 150,000',
        method: 'DFCU Bank',
        methodIcon: Building2,
        status: 'Completed',
        description: 'Annual membership subscription for 2021-2022',
      },
      {
        date: '2021-08-15',
        type: 'Workshop Fee',
        reference: 'APF-WRK-21-008',
        amount: 'UGX 75,000',
        method: 'MTN Mobile Money',
        methodIcon: Smartphone,
        status: 'Completed',
        description: 'Professional development workshop registration',
      },
      {
        date: '2021-03-10',
        type: 'CPD Event',
        reference: 'APF-CPD-21-003',
        amount: 'UGX 25,000',
        method: 'Airtel Money',
        methodIcon: Wallet,
        status: 'Completed',
        description: 'Continuing Professional Development seminar',
      },
      {
        date: '2020-11-20',
        type: 'Annual Subscription',
        reference: 'APF-SUB-20-001',
        amount: 'UGX 150,000',
        method: 'DFCU Bank',
        methodIcon: Building2,
        status: 'Completed',
        description: 'Annual membership subscription for 2020-2021',
      },
    ]
  }

  /**
   * Get recent transactions (last 3-5 transactions)
   */
  static getRecentTransactions(limit: number = 3): Transaction[] {
    return this.getAllTransactions().slice(0, limit)
  }

  /**
   * Filter transactions based on criteria
   */
  static filterTransactions(
    transactions: Transaction[],
    dateRange: string,
    paymentType: string,
    status: string
  ): Transaction[] {
    return transactions.filter(transaction => {
      // Date range filter
      const transactionDate = new Date(transaction.date)
      const now = new Date()
      let dateMatch = true
      
      switch (dateRange) {
        case 'last7':
          dateMatch = transactionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'last30':
          dateMatch = transactionDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'last90':
          dateMatch = transactionDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case 'lastyear':
          dateMatch = transactionDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          dateMatch = true
      }
      
      // Payment type filter
      const typeMatch = paymentType === 'all' || transaction.type.toLowerCase().includes(paymentType.toLowerCase())
      
      // Status filter
      const statusMatch = status === 'all' || transaction.status.toLowerCase() === status.toLowerCase()
      
      return dateMatch && typeMatch && statusMatch
    })
  }

  /**
   * Get all receipts
   */
  static getAllReceipts(): Receipt[] {
    return [
      {
        id: 'receipt-2023-001',
        title: 'Annual Membership Invoice 2023',
        date: 'November 20, 2023',
        amount: 'UGX 150,000',
        type: 'invoice',
        reference: 'APF-SUB-23-001',
      },
      {
        id: 'receipt-2022-001',
        title: 'Annual Membership Invoice 2022',
        date: 'November 20, 2022',
        amount: 'UGX 150,000',
        type: 'invoice',
        reference: 'APF-SUB-22-001',
      },
      {
        id: 'receipt-2023-002',
        title: 'Application Fee Receipt 2023',
        date: 'January 15, 2023',
        amount: 'UGX 50,000',
        type: 'receipt',
        reference: 'APF-APP-23-005',
      },
      {
        id: 'receipt-2022-002',
        title: 'Donation Receipt 2022',
        date: 'June 1, 2022',
        amount: 'UGX 100,000',
        type: 'receipt',
        reference: 'APF-DON-22-001',
      },
      {
        id: 'receipt-2021-001',
        title: 'Annual Membership Invoice 2021',
        date: 'November 20, 2021',
        amount: 'UGX 150,000',
        type: 'invoice',
        reference: 'APF-SUB-21-001',
      },
      {
        id: 'receipt-2021-002',
        title: 'Workshop Fee Receipt 2021',
        date: 'August 15, 2021',
        amount: 'UGX 75,000',
        type: 'receipt',
        reference: 'APF-WRK-21-001',
      },
    ]
  }

  /**
   * Search transactions by reference, type, or description
   */
  static searchTransactions(transactions: Transaction[], searchTerm: string): Transaction[] {
    if (!searchTerm.trim()) return transactions
    
    const term = searchTerm.toLowerCase()
    return transactions.filter(transaction => 
      transaction.reference.toLowerCase().includes(term) ||
      transaction.type.toLowerCase().includes(term) ||
      transaction.description.toLowerCase().includes(term) ||
      transaction.method.toLowerCase().includes(term)
    )
  }

  /**
   * Get transaction by reference
   */
  static getTransactionByReference(reference: string): Transaction | undefined {
    return this.getAllTransactions().find(transaction => transaction.reference === reference)
  }

  /**
   * Get transactions by type
   */
  static getTransactionsByType(type: string): Transaction[] {
    return this.getAllTransactions().filter(transaction => 
      transaction.type.toLowerCase().includes(type.toLowerCase())
    )
  }

  /**
   * Get transactions by method
   */
  static getTransactionsByMethod(method: string): Transaction[] {
    return this.getAllTransactions().filter(transaction => 
      transaction.method.toLowerCase().includes(method.toLowerCase())
    )
  }
}