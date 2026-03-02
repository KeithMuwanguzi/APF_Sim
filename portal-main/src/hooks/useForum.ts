import { useState, useEffect } from 'react'
import { ForumPost, ForumCategory, ActiveUser, ForumStats } from '../types/forum'
import { 
  getForumPosts, 
  getForumCategories, 
  getActiveUsers, 
  getForumStats,
  getUserPosts 
} from '../services/forum.service'

/**
 * Hook for forum posts management
 * @param category - Optional category filter
 * @param filter - Optional filter (all, popular, recent, unanswered)
 */
export const useForumPosts = (category?: string, filter?: string) => {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getForumPosts(category, filter)
        setPosts(data)
      } catch (err) {
        setError('Failed to load forum posts')
        console.error('Forum posts error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category, filter])

  return {
    posts,
    loading,
    error
  }
}

/**
 * Hook for forum categories
 */
export const useForumCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getForumCategories()
        setCategories(data)
      } catch (err) {
        setError('Failed to load categories')
        console.error('Forum categories error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error
  }
}

/**
 * Hook for active users
 */
export const useActiveUsers = () => {
  const [users, setUsers] = useState<ActiveUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getActiveUsers()
        setUsers(data)
      } catch (err) {
        setError('Failed to load active users')
        console.error('Active users error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error
  }
}

/**
 * Hook for forum statistics
 */
export const useForumStats = () => {
  const [stats, setStats] = useState<ForumStats>({
    totalMembers: 0,
    activeToday: 0,
    totalPosts: 0,
    totalReplies: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getForumStats()
        setStats(data)
      } catch (err) {
        setError('Failed to load forum stats')
        console.error('Forum stats error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error
  }
}

/**
 * Hook for user's own posts
 */
export const useUserPosts = () => {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getUserPosts()
        setPosts(data)
      } catch (err) {
        setError('Failed to load your posts')
        console.error('User posts error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      const data = await getUserPosts()
      setPosts(data)
    } catch (err) {
      setError('Failed to refresh posts')
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    loading,
    error,
    refetch
  }
}
