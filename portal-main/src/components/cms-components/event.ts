export interface PortalEvent {
    id: string;
    title: string;
    description: string;
    startDate: string; // ISO format
    endDate: string;
    location: string;
    isVirtual: boolean;
    meetingLink?: string;
    featuredImage: string;
    status: 'Published' | 'Draft' | 'Cancelled';
  }