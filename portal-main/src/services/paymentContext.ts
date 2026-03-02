export interface PaymentContext {
  id: string
  type: 'subscription' | 'event' | 'workshop' | 'donation' | 'application'
  title: string
  description: string
  amount: string
  dueDate?: string
  eventDate?: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'overdue' | 'upcoming'
  icon: string
}

export interface PaymentContextResponse {
  currentPayment: PaymentContext | null
  upcomingPayments: PaymentContext[]
  overduePayments: PaymentContext[]
}

// Mock service - replace with actual API calls
export const getPaymentContext = async (): Promise<PaymentContextResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock data - this would come from your backend
  const mockData: PaymentContextResponse = {
    currentPayment: {
      id: 'sub-2026-001',
      type: 'subscription',
      title: 'Annual Membership Renewal',
      description: 'Your APF membership expires on March 15, 2026. Renew now to maintain your benefits.',
      amount: 'UGX 150,000',
      dueDate: '2026-03-15',
      priority: 'high',
      status: 'upcoming',
      icon: 'subscription'
    },
    upcomingPayments: [
      {
        id: 'event-2026-001',
        type: 'event',
        title: 'Annual Conference 2026',
        description: 'Early bird registration for the APF Annual Conference',
        amount: 'UGX 75,000',
        eventDate: '2026-06-15',
        dueDate: '2026-05-01',
        priority: 'medium',
        status: 'upcoming',
        icon: 'calendar'
      },
      {
        id: 'workshop-2026-001',
        type: 'workshop',
        title: 'Digital Accounting Workshop',
        description: 'Professional development workshop on digital accounting practices',
        amount: 'UGX 50,000',
        eventDate: '2026-04-20',
        dueDate: '2026-04-10',
        priority: 'low',
        status: 'upcoming',
        icon: 'book'
      }
    ],
    overduePayments: []
  }

  return mockData
}

// Function to determine what should be shown as the primary payment context
export const getPrimaryPaymentContext = (data: PaymentContextResponse): PaymentContext | null => {
  // Priority: Overdue > Current > Upcoming (by priority)
  if (data.overduePayments.length > 0) {
    return data.overduePayments[0]
  }
  
  if (data.currentPayment) {
    return data.currentPayment
  }
  
  if (data.upcomingPayments.length > 0) {
    // Sort by priority and return the highest priority
    const sortedUpcoming = data.upcomingPayments.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    return sortedUpcoming[0]
  }
  
  return null
}

// Function to get payment context display info
export const getPaymentDisplayInfo = (context: PaymentContext) => {
  const baseInfo = {
    title: context.title,
    description: context.description,
    amount: context.amount,
    buttonText: 'Pay Now',
    urgencyColor: 'purple'
  }

  switch (context.type) {
    case 'subscription':
      return {
        ...baseInfo,
        buttonText: 'Renew Membership',
        urgencyColor: context.status === 'overdue' ? 'red' : 'purple'
      }
    case 'event':
      return {
        ...baseInfo,
        buttonText: 'Register for Event',
        urgencyColor: 'blue'
      }
    case 'workshop':
      return {
        ...baseInfo,
        buttonText: 'Register for Workshop',
        urgencyColor: 'green'
      }
    case 'donation':
      return {
        ...baseInfo,
        buttonText: 'Make Donation',
        urgencyColor: 'yellow'
      }
    case 'application':
      return {
        ...baseInfo,
        buttonText: 'Pay Application Fee',
        urgencyColor: 'orange'
      }
    default:
      return baseInfo
  }
}