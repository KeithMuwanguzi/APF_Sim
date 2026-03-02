// Post Status Types
export type PostStatus = 'draft' | 'published' | 'reported' | 'archived';

// Report Reason Types
export type ReportReason = 'spam' | 'offensive' | 'harassment' | 'misinformation' | 'other';

// Report Status Types
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

// Author Interface
export interface Author {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  initials: string;
}

// Category Interface
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  post_count: number;
  created_at: string;
  updated_at: string;
}

// Tag Interface
export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

// Comment Interface
export interface Comment {
  id: number;
  post: number;
  author: Author;
  content: string;
  parent: number | null;
  is_edited: boolean;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

// Like Interface
export interface Like {
  id: number;
  post: number;
  user: Author;
  created_at: string;
}

// Forum Post Interface (List View)
export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: Author;
  category: Category | null;
  tags: Tag[];
  status: PostStatus;
  views_count: number;
  comment_count: number;
  like_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
  // For display purposes in admin components
  authorName?: string;
  authorInitials?: string;
  date?: string;
  comments?: number;
}

// Forum Post Detail Interface (includes comments)
export interface ForumPostDetail extends Omit<ForumPost, 'comments'> {
  comments: Comment[];
}

// Report Interface
export interface Report {
  id: number;
  post: ForumPost;
  reporter: Author;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reviewed_by: Author | null;
  created_at: string;
  updated_at: string;
}

// Forum Statistics Interface
export interface ForumStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  reported_posts: number;
  total_comments: number;
  total_likes: number;
  active_users: number;
  pending_reports: number;
}

// API Request/Response Types
export interface CreatePostRequest {
  title: string;
  content: string;
  category_id?: number;
  tag_ids?: number[];
  status: PostStatus;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  is_pinned?: boolean;
  is_locked?: boolean;
}

export interface CreateCommentRequest {
  post: number;
  content: string;
  parent?: number;
}

export interface CreateReportRequest {
  post_id: number;
  reason: ReportReason;
  description?: string;
}

export interface ForumPostFilters {
  status?: PostStatus;
  category?: string;
  tag?: string;
  author?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}