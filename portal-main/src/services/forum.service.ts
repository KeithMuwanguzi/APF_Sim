/**
 * Forum service - handles all forum-related API calls
 */

import axios from 'axios'
import { ForumPost, ForumCategory, ActiveUser, ForumStats } from '../types/forum'
import { API_BASE_URL } from '../config/api'
import { getAccessToken } from '../utils/authStorage';

type ApiAuthor = {
  id: number
  full_name?: string
  initials?: string
  profile_picture_url?: string | null
  email?: string
  first_name?: string
  last_name?: string
}

type ApiCategory = {
  id: number
  name: string
  slug: string
  post_count?: number
}

type ApiPost = {
  id: number
  title: string
  content: string
  author: ApiAuthor
  viewers?: ApiAuthor[]
  category?: ApiCategory | null
  comment_count?: number
  like_count?: number
  is_liked?: boolean
  views_count?: number
  created_at: string
  status?: string
}

type ApiComment = {
  id: number
  post: number
  author: ApiAuthor
  content: string
  parent: number | null
  is_edited: boolean
  reply_count: number
  created_at: string
  updated_at: string
}

const api = axios.create({
  baseURL: API_BASE_URL
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const formatRelativeTime = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const toExcerpt = (content: string, maxLen: number = 160) => {
  const clean = content?.trim() || ''
  if (clean.length <= maxLen) return clean
  return `${clean.slice(0, maxLen - 3)}...`
}

const mapPost = (post: ApiPost): ForumPost => {
  const authorName =
    post.author?.full_name ||
    [post.author?.first_name, post.author?.last_name].filter(Boolean).join(' ') ||
    post.author?.email?.split('@')[0] ||
    'Member'

  return {
    id: post.id,
    title: post.title,
    author: authorName,
    authorInitials: post.author?.initials || authorName.slice(0, 2).toUpperCase(),
    authorProfilePictureUrl: post.author?.profile_picture_url || null,
    viewers: post.viewers || [],
    time: formatRelativeTime(post.created_at),
    category: post.category?.name || 'General',
    excerpt: toExcerpt(post.content),
    replies: post.comment_count || 0,
    likes: post.like_count || 0,
    views: post.views_count || 0,
    content: post.content,
    status: (post.status as ForumPost['status']) || 'published'
  }
}

/**
 * Get all forum posts
 * @param _category - Optional category filter
 * @param _filter - Optional filter (all, popular, recent, unanswered)
 * @returns Promise with array of forum posts
 */
export const getForumPosts = async (
  _category?: string,
  _filter?: string
): Promise<ForumPost[]> => {
  const params: Record<string, string> = {}
  if (_category) {
    params.category = _category
  }

  if (_filter === 'popular') {
    params.ordering = '-likes_total'
  } else if (_filter === 'recent') {
    params.ordering = '-created_at'
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    params.date_from = twoHoursAgo.toISOString()
  } else {
    params.ordering = '-created_at'
  }

  params.status = 'published'

  const response = await api.get<any>('/api/v1/forum/posts/', { params })
  const payload = Array.isArray(response.data) ? response.data : response.data?.results || []
  let posts = (payload as ApiPost[]).map(mapPost)

  if (_filter === 'unanswered') {
    posts = posts.filter((post) => post.replies === 0)
  }

  return posts
}

/**
 * Get a single forum post by ID
 * @param _postId - Post ID
 * @returns Promise with forum post details
 */
export const getForumPost = async (_postId: number): Promise<ForumPost | null> => {
  try {
    const response = await api.get<ApiPost>(`/api/v1/forum/posts/${_postId}/`)
    return mapPost(response.data)
  } catch (error) {
    console.error('Failed to fetch forum post:', error)
    return null
  }
}

export const getForumPostDetail = async (_postId: number): Promise<ApiPost | null> => {
  try {
    const response = await api.get<ApiPost>(`/api/v1/forum/posts/${_postId}/`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch forum post detail:', error)
    return null
  }
}

/**
 * Get forum categories with post counts
 * @returns Promise with array of categories
 */
export const getForumCategories = async (): Promise<ForumCategory[]> => {
  const response = await api.get<ApiCategory[]>('/api/v1/forum/categories/')
  return response.data.map((category) => ({
    id: category.slug,
    slug: category.slug,
    rawId: category.id,
    name: category.name,
    icon: null,
    count: category.post_count || 0
  }))
}

/**
 * Get active users in the forum
 * @returns Promise with array of active users
 */
export const getActiveUsers = async (): Promise<ActiveUser[]> => {
  try {
    const response = await api.get<Array<{
      name: string
      initials: string
      status: 'online' | 'away' | 'offline'
      last_seen: string
      profile_picture_url?: string | null
    }>>('/api/v1/forum/posts/active_users/')

    const formatLastSeen = (iso: string) => {
      const date = new Date(iso)
      if (Number.isNaN(date.getTime())) return ''
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString()
    }

    return response.data.map((user) => ({
      name: user.name,
      initials: user.initials,
      status: user.status,
      lastSeen: formatLastSeen(user.last_seen)
    }))
  } catch (error) {
    console.error('Failed to fetch active users:', error)
    return []
  }
}

/**
 * Get forum statistics
 * @returns Promise with forum stats
 */
export const getForumStats = async (): Promise<ForumStats> => {
  const response = await api.get<{
    total_posts: number
    total_comments: number
    active_users: number
  }>('/api/v1/forum/posts/stats/')

  return {
    totalMembers: response.data.active_users || 0,
    activeToday: response.data.active_users || 0,
    totalPosts: response.data.total_posts || 0,
    totalReplies: response.data.total_comments || 0
  }
}

/**
 * Create a new forum post
 * @param _postData - Post data
 * @returns Promise with created post
 */
export const createForumPost = async (_postData: any): Promise<ForumPost | null> => {
  try {
    const response = await api.post<ApiPost>('/api/v1/forum/posts/', _postData)
    return mapPost(response.data)
  } catch (error) {
    console.error('Failed to create forum post:', error)
    return null
  }
}

export const updateForumPost = async (_postId: number, _postData: any): Promise<ForumPost | null> => {
  try {
    const response = await api.patch<ApiPost>(`/api/v1/forum/posts/${_postId}/`, _postData)
    return mapPost(response.data)
  } catch (error) {
    console.error('Failed to update forum post:', error)
    return null
  }
}

export const getForumComments = async (_postId: number): Promise<ApiComment[]> => {
  try {
    const response = await api.get<ApiComment[]>('/api/v1/forum/comments/', {
      params: { post: _postId, parent_only: 'true' }
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return []
  }
}

export const createForumComment = async (
  _postId: number,
  _content: string,
  _parent?: number | null
): Promise<ApiComment | null> => {
  try {
    const payload: { post: number; content: string; parent?: number | null } = {
      post: _postId,
      content: _content
    }
    if (_parent) payload.parent = _parent
    const response = await api.post<ApiComment>('/api/v1/forum/comments/', payload)
    return response.data
  } catch (error) {
    console.error('Failed to create comment:', error)
    return null
  }
}

export const deleteForumPost = async (_postId: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/api/v1/forum/posts/${_postId}/`)
    return response.status >= 200 && response.status < 300
  } catch (error) {
    console.error('Failed to delete forum post:', error)
    return false
  }
}

export const getForumPostViewers = async (_postId: number): Promise<ApiAuthor[]> => {
  try {
    const response = await api.get<ApiAuthor[]>(`/api/v1/forum/posts/${_postId}/viewers/`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch post viewers:', error)
    return []
  }
}

/**
 * Get user's own posts
 * @returns Promise with array of user's posts
 */
export const getUserPosts = async (): Promise<ForumPost[]> => {
  const response = await api.get<any>('/api/v1/forum/posts/my_posts/')
  const payload = Array.isArray(response.data) ? response.data : response.data?.results || []
  return (payload as ApiPost[]).map(mapPost)
}

/**
 * Like a forum post
 * @param _postId - Post ID
 * @returns Promise with like result
 */
export const likePost = async (_postId: number): Promise<boolean> => {
  try {
    const response = await api.post(`/api/v1/forum/posts/${_postId}/like/`)
    return response.status >= 200 && response.status < 300
  } catch (error) {
    console.error('Failed to like post:', error)
    return false
  }
}

export const likeForumPost = async (_postId: number): Promise<number | null> => {
  try {
    const response = await api.post<{ like_count: number }>(`/api/v1/forum/posts/${_postId}/like/`)
    return response.data.like_count ?? null
  } catch (error) {
    console.error('Failed to like post:', error)
    return null
  }
}

export const unlikeForumPost = async (_postId: number): Promise<number | null> => {
  try {
    const response = await api.post<{ like_count: number }>(`/api/v1/forum/posts/${_postId}/unlike/`)
    return response.data.like_count ?? null
  } catch (error) {
    console.error('Failed to unlike post:', error)
    return null
  }
}

/**
 * Bookmark a forum post
 * @param _postId - Post ID
 * @returns Promise with bookmark result
 */
export const bookmarkPost = async (_postId: number): Promise<boolean> => {
  return false
}
