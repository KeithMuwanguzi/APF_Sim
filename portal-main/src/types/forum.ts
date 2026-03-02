/**
 * Forum and community type definitions
 */

export interface ForumPost {
  id: number
  title: string
  author: string
  authorInitials: string
  authorProfilePictureUrl?: string | null
  viewers?: ForumViewer[]
  time: string
  category: string
  excerpt: string
  replies: number
  likes: number
  views: number
  content?: string
  status?: 'published' | 'draft' | 'archived'
}

export interface ForumViewer {
  id: number
  full_name?: string
  initials?: string
  profile_picture_url?: string | null
}

export interface ForumCategory {
  id: string
  name: string
  icon: any
  count: number
  rawId?: number
  slug?: string
}

export interface ActiveUser {
  name: string
  initials: string
  status: 'online' | 'away' | 'offline'
  lastSeen: string
}

export interface ForumStats {
  totalMembers: number
  activeToday: number
  totalPosts: number
  totalReplies: number
}
