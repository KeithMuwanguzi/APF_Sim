export type ArticleStatus = 'Published' | 'Draft' | 'Scheduled';
export type Category = 'News' | 'Update' | 'Announcement';
export type BlockType = 'text' | 'image' | 'video' | 'attachment';

export interface ContentBlock {
  id: string;
  type: BlockType;
  value: string;      // The actual text, image URL, or video link
  fileName?: string;  // Specifically for attachments
  caption?: string;   // For media descriptions
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  status: ArticleStatus;
  publishDate: string | null;
  views: string;
  featuredImage?: string; 
  contentBlocks: ContentBlock[]; 
}