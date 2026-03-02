export type StatusType = 'Sent' | 'Scheduled' | 'Draft';
export type ChannelType = 'Email' | 'In-App' | 'Both';

export interface Announcement {
  id: string | number;
  title: string;
  audience: string;
  channel: ChannelType;
  status: StatusType;
  createdBy: string;
  date: string;
}