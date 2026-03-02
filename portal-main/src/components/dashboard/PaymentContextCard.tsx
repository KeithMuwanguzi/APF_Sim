import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  Calendar,
  Book,
  Heart,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  getPaymentContext, 
  getPrimaryPaymentContext, 
  getPaymentDisplayInfo,
  PaymentContext 
} from '../../services/paymentContext'

const PaymentContextCard: React.FC = () => {
  const [paymentContext, setPaymentContext] = useState<PaymentContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPaymentContext = async () => {
      try {
        setIsLoading(true)
        const data = await getPaymentContext()
        const primaryContext = getPrimaryPaymentContext(data)
        setPaymentContext(primaryContext)
      } catch (err) {
        setError('Failed to load payment information')
        console.error('Payment context error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentContext()
  }, [])

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'subscription':
        return CreditCard
      case 'calendar':
        return Calendar
      case 'book':
        return Book
      case 'heart':
        return Heart
      case 'file':
        return FileText
      default:
        return CreditCard
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return AlertTriangle
      case 'upcoming':
        return Clock
      case 'pending':
        return Clock
      default:
        return CheckCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-700'
      case 'upcoming':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-green-100 text-green-700'
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
          <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
            <span className="hidden sm:inline">Payment Context</span>
            <span className="sm:hidden">Payments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !paymentContext) {
    return (
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
          <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
            <span className="hidden sm:inline">Payment Context</span>
            <span className="sm:hidden">Payments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              {error || 'No payment information available'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayInfo = getPaymentDisplayInfo(paymentContext)
  const IconComponent = getIcon(paymentContext.icon)
  const StatusIcon = getStatusIcon(paymentContext.status)
  const statusColorClass = getStatusColor(paymentContext.status)

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4">
        <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
          <span className="hidden sm:inline">Payment Context</span>
          <span className="sm:hidden">Payments</span>
        </CardTitle>
        <Badge className={`${statusColorClass} text-xs`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {paymentContext.status}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-3 md:space-y-4">
        <div>
          <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
            {displayInfo.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            {displayInfo.description}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs md:text-sm text-gray-500">Amount</span>
          <span className="font-bold text-sm md:text-base text-gray-900">
            {displayInfo.amount}
          </span>
        </div>

        {paymentContext.dueDate && (
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm text-gray-500">Due Date</span>
            <span className="text-xs md:text-sm text-gray-700">
              {new Date(paymentContext.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="pt-2">
          <Link to="/payments" className="w-full">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {displayInfo.buttonText}
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentContextCard