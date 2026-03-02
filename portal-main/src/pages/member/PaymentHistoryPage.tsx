import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  History,
  Calendar,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Search,
  ChevronLeft,
  FileText,
} from "lucide-react"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { getCurrentDateFormatted } from "../../utils/dateUtils"
import { ReceiptGenerator, TransactionData, showNotification } from "../../services/receiptGenerator"
import { usePaymentHistory } from "../../hooks/usePaymentHistory"

const PaymentHistoryPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30')
  const [paymentType, setPaymentType] = useState('all')
  const [status, setStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Use hook to fetch transactions
  const { transactions, loading, error } = usePaymentHistory()

  const handleDownloadReceipt = async (transaction: any) => {
    try {
      showNotification('Generating PDF receipt...', 'success')
      
      const transactionData: TransactionData = {
        reference: transaction.reference,
        type: transaction.type,
        date: transaction.date,
        description: transaction.description,
        method: transaction.method,
        amount: transaction.amount,
        status: transaction.status
      }
      
      const pdf = await ReceiptGenerator.generateTransactionReceiptPDF(transactionData)
      const filename = `APF_${transaction.reference}_Receipt.pdf`
      ReceiptGenerator.downloadPDF(pdf, filename)
      
      showNotification(`Receipt for ${transaction.reference} downloaded successfully`, 'success')
    } catch (error) {
      console.error('Download error:', error)
      showNotification('Failed to generate PDF receipt', 'error')
    }
  }

  const handleExportTransactions = () => {
    if (transactions.length === 0) {
      showNotification('No transactions to export', 'error')
      return
    }

    try {
      let csvContent = 'Date,Type,Reference,Amount,Method,Status,Description\n'
      
      transactions.forEach(transaction => {
        const row = [
          transaction.date,
          transaction.type,
          transaction.reference,
          transaction.amount.replace(',', ''),
          transaction.method,
          transaction.status,
          `"${transaction.description}"`
        ].join(',')
        csvContent += row + '\n'
      })
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `APF_Payment_History_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showNotification('Payment history exported successfully', 'success')
    } catch (error) {
      console.error('Export error:', error)
      showNotification('Failed to export payment history', 'error')
    }
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert('Loading more transactions...')
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'annual subscription':
        return 'bg-purple-100 text-purple-700'
      case 'application fee':
        return 'bg-blue-100 text-blue-700'
      case 'donation':
        return 'bg-green-100 text-green-700'
      case 'workshop fee':
        return 'bg-orange-100 text-orange-700'
      case 'cpd event':
        return 'bg-indigo-100 text-indigo-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        headerContent={
          <Link 
            to="/payments" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Payments
          </Link>
        }
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment history...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
        headerContent={
          <Link 
            to="/payments" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Payments
          </Link>
        }
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-900 font-semibold mb-2">Failed to load payment history</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      headerContent={
        <Link 
          to="/payments" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Payments
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
            <p className="text-gray-600">Complete transaction history and detailed payment records</p>
          </div>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {getCurrentDateFormatted()}
          </div>
        </div>

        {/* Empty State */}
        {transactions.length === 0 ? (
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment History Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven't made any payments yet. Once you complete a transaction, it will appear here.
                </p>
                <Link to="/payments">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Make a Payment
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filters Card */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Transactions
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportTransactions}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
                    <select 
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="last30">Last 30 Days</option>
                      <option value="last90">Last 90 Days</option>
                      <option value="last12">Last 12 Months</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Type</label>
                    <select 
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="all">All Types</option>
                      <option value="subscription">Annual Subscription</option>
                      <option value="application">Application Fee</option>
                      <option value="donation">Donation</option>
                      <option value="workshop">Workshop Fee</option>
                      <option value="cpd">CPD Event</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        placeholder="Reference number..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Transaction History
                </CardTitle>
                <div className="text-sm text-gray-600">
                  Showing {transactions.length} transactions
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Reference</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Description</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Method</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => {
                        const MethodIcon = transaction.methodIcon
                        return (
                          <tr key={index} className="border-b hover:bg-purple-50/30 transition-colors">
                            <td className="py-4 px-4 text-sm font-medium text-gray-900">
                              {transaction.date}
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={`text-xs ${getTypeColor(transaction.type)}`}>
                                {transaction.type}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                              {transaction.reference}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 max-w-xs">
                              <div className="truncate" title={transaction.description}>
                                {transaction.description}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                              {transaction.amount}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                  {MethodIcon ? (
                                    <MethodIcon className="w-3 h-3 text-purple-600" />
                                  ) : (
                                    <FileText className="w-3 h-3 text-purple-600" />
                                  )}
                                </div>
                                <span className="text-sm text-gray-600">{transaction.method}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => alert(`Viewing details for ${transaction.reference}`)}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDownloadReceipt(transaction)}
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Load More Transactions
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PaymentHistoryPage