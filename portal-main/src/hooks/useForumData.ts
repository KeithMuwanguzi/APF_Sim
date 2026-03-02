/**
 * Custom hooks for forum data management
 * 
 * Following React best practices with proper state management,
 * error handling, and loading states.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ForumPost,
  ForumPostDetail,
  Category,
  Tag,
  Comment,
  Report,
  ForumStats,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  CreateReportRequest,
  ForumPostFilters,
  PaginatedResponse,
} from '../components/adminForum-components/types';
import * as forumApi from '../services/forumApi';

// ============================================================================
// GENERIC HOOK TYPES
// ============================================================================

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseListDataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

interface UseMutationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// ============================================================================
// FORUM POSTS HOOKS
// ============================================================================

/**
 * Hook to fetch forum posts with filters
 */
export const useForumPosts = (filters?: ForumPostFilters) => {
  const [state, setState] = useState<UseDataState<PaginatedResponse<ForumPost>>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchPosts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await forumApi.fetchForumPosts(filters);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
      });
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { ...state, refetch: fetchPosts };
};

/**
 * Hook to fetch a single forum post
 */
export const useForumPost = (id: number | null) => {
  const [state, setState] = useState<UseDataState<ForumPostDetail>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchPost = useCallback(async () => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await forumApi.fetchForumPostById(id);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch post',
      });
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { ...state, refetch: fetchPost };
};

/**
 * Hook to create a forum post
 */
export const useCreatePost = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createPost = async (data: CreatePostRequest): Promise<ForumPost | null> => {
    setState({ loading: true, error: null, success: false });
    try {
      const post = await forumApi.createForumPost(data);
      setState({ loading: false, error: null, success: true });
      return post;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create post',
        success: false,
      });
      return null;
    }
  };

  return { ...state, createPost };
};

/**
 * Hook to update a forum post
 */
export const useUpdatePost = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const updatePost = async (id: number, data: UpdatePostRequest): Promise<ForumPost | null> => {
    setState({ loading: true, error: null, success: false });
    try {
      const post = await forumApi.updateForumPost(id, data);
      setState({ loading: false, error: null, success: true });
      return post;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update post',
        success: false,
      });
      return null;
    }
  };

  return { ...state, updatePost };
};

/**
 * Hook to delete a forum post
 */
export const useDeletePost = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const deletePost = async (id: number): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      await forumApi.deleteForumPost(id);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete post',
        success: false,
      });
      return false;
    }
  };

  return { ...state, deletePost };
};

/**
 * Hook to toggle like on a post
 */
export const useToggleLike = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const toggleLike = async (id: number, isLiked: boolean): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      if (isLiked) {
        await forumApi.unlikeForumPost(id);
      } else {
        await forumApi.likeForumPost(id);
      }
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to toggle like',
        success: false,
      });
      return false;
    }
  };

  return { ...state, toggleLike };
};

// ============================================================================
// CATEGORIES & TAGS HOOKS
// ============================================================================

/**
 * Hook to fetch categories
 */
export const useCategories = () => {
  const [state, setState] = useState<UseListDataState<Category>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchCategories = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await forumApi.fetchCategories();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      });
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { ...state, refetch: fetchCategories };
};

/**
 * Hook to fetch tags
 */
export const useTags = (search?: string) => {
  const [state, setState] = useState<UseListDataState<Tag>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchTags = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await forumApi.fetchTags(search);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tags',
      });
    }
  }, [search]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { ...state, refetch: fetchTags };
};

// ============================================================================
// STATISTICS HOOK
// ============================================================================

/**
 * Hook to fetch forum statistics
 */
export const useForumStats = () => {
  const [state, setState] = useState<UseDataState<ForumStats>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await forumApi.fetchForumStats();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch statistics',
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { ...state, refetch: fetchStats };
};

// ============================================================================
// COMMENTS HOOKS
// ============================================================================

/**
 * Hook to fetch comments for a post
 */
export const useComments = (postId: number | null, parentOnly?: boolean) => {
  const [state, setState] = useState<UseListDataState<Comment>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await forumApi.fetchComments(postId, parentOnly);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch comments',
      });
    }
  }, [postId, parentOnly]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { ...state, refetch: fetchComments };
};

/**
 * Hook to create a comment
 */
export const useCreateComment = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createComment = async (data: CreateCommentRequest): Promise<Comment | null> => {
    setState({ loading: true, error: null, success: false });
    try {
      const comment = await forumApi.createComment(data);
      setState({ loading: false, error: null, success: true });
      return comment;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create comment',
        success: false,
      });
      return null;
    }
  };

  return { ...state, createComment };
};

// ============================================================================
// REPORTS HOOKS
// ============================================================================

/**
 * Hook to fetch reports
 */
export const useReports = (status?: string) => {
  const [state, setState] = useState<UseListDataState<Report>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchReports = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await forumApi.fetchReports(status);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch reports',
      });
    }
  }, [status]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { ...state, refetch: fetchReports };
};

/**
 * Hook to create a report
 */
export const useCreateReport = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const createReport = async (data: CreateReportRequest): Promise<Report | null> => {
    setState({ loading: true, error: null, success: false });
    try {
      const report = await forumApi.createReport(data);
      setState({ loading: false, error: null, success: true });
      return report;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create report',
        success: false,
      });
      return null;
    }
  };

  return { ...state, createReport };
};

/**
 * Hook to manage report actions (review, resolve, dismiss)
 */
export const useManageReport = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const reviewReport = async (id: number): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      await forumApi.reviewReport(id);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to review report',
        success: false,
      });
      return false;
    }
  };

  const resolveReport = async (id: number): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      await forumApi.resolveReport(id);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to resolve report',
        success: false,
      });
      return false;
    }
  };

  const dismissReport = async (id: number): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      await forumApi.dismissReport(id);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to dismiss report',
        success: false,
      });
      return false;
    }
  };

  return { ...state, reviewReport, resolveReport, dismissReport };
};

// ============================================================================
// POST MANAGEMENT HOOKS (Admin Actions)
// ============================================================================

/**
 * Hook to toggle post pin status
 */
export const useTogglePin = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const togglePin = async (id: number): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      await forumApi.togglePinPost(id);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to toggle pin',
        success: false,
      });
      return false;
    }
  };

  return { ...state, togglePin };
};

/**
 * Hook to toggle post lock status
 */
export const useToggleLock = () => {
  const [state, setState] = useState<UseMutationState>({
    loading: false,
    error: null,
    success: false,
  });

  const toggleLock = async (id: number): Promise<boolean> => {
    setState({ loading: true, error: null, success: false });
    try {
      await forumApi.toggleLockPost(id);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to toggle lock',
        success: false,
      });
      return false;
    }
  };

  return { ...state, toggleLock };
};
