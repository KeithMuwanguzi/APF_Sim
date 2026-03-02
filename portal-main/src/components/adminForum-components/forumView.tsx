

import  StatsCard  from '../../components/adminForum-components/statscard';
import  FilterBar  from '../../components/adminForum-components/filter';
import  { PostTable } from '../../components/adminForum-components/postTable';
import { ForumPost } from './types';


const MOCK_DATA: ForumPost[] = [
  { 
    id: 1, 
    title: 'How to create a realistic monthly budget?', 
    content: 'Content here',
    author: { id: 1, email: 'samantha@example.com', first_name: 'Samantha', last_name: 'Lee', full_name: 'Samantha Lee', initials: 'SL' },
    category: { id: 1, name: 'Budgeting', slug: 'budgeting', description: 'Budgeting tips', icon: '💰', post_count: 42, created_at: '2026-03-12', updated_at: '2026-03-12' },
    tags: [
      { id: 1, name: 'budgeting', slug: 'budgeting', created_at: '2026-03-12' },
      { id: 2, name: 'discussion', slug: 'discussion', created_at: '2026-03-12' }
    ],
    status: 'published',
    views_count: 1289,
    comment_count: 42,
    like_count: 32,
    is_pinned: false,
    is_locked: false,
    is_liked: false,
    created_at: '2026-03-12',
    updated_at: '2026-03-12',
    authorName: 'Samantha Lee',
    authorInitials: 'SL',
    date: 'Mar 12, 2026',
    comments: 42
  },
  { 
    id: 2, 
    title: 'Best savings accounts with high interest rates in 2026', 
    content: 'Content here',
    author: { id: 2, email: 'michael@example.com', first_name: 'Michael', last_name: 'Johnson', full_name: 'Michael Johnson', initials: 'MJ' },
    category: { id: 2, name: 'Savings', slug: 'savings', description: 'Savings tips', icon: '🏦', post_count: 28, created_at: '2026-03-10', updated_at: '2026-03-10' },
    tags: [
      { id: 1, name: 'savings', slug: 'savings', created_at: '2026-03-10' },
      { id: 2, name: 'discussion', slug: 'discussion', created_at: '2026-03-10' }
    ],
    status: 'published',
    views_count: 856,
    comment_count: 28,
    like_count: 15,
    is_pinned: false,
    is_locked: false,
    is_liked: false,
    created_at: '2026-03-10',
    updated_at: '2026-03-10',
    authorName: 'Michael Johnson',
    authorInitials: 'MJ',
    date: 'Mar 10, 2026',
    comments: 28
  },
  { 
    id: 3, 
    title: 'Investment strategies for beginners - Need advice', 
    content: 'Content here',
    author: { id: 3, email: 'robert@example.com', first_name: 'Robert', last_name: 'Davis', full_name: 'Robert Davis', initials: 'RD' },
    category: { id: 3, name: 'Investing', slug: 'investing', description: 'Investing tips', icon: '📈', post_count: 15, created_at: '2026-03-08', updated_at: '2026-03-08' },
    tags: [
      { id: 3, name: 'investing', slug: 'investing', created_at: '2026-03-08' },
      { id: 4, name: 'help', slug: 'help', created_at: '2026-03-08' }
    ],
    status: 'draft',
    views_count: 432,
    comment_count: 15,
    like_count: 8,
    is_pinned: false,
    is_locked: false,
    is_liked: false,
    created_at: '2026-03-08',
    updated_at: '2026-03-08',
    authorName: 'Robert Davis',
    authorInitials: 'RD',
    date: 'Mar 8, 2026',
    comments: 15
  },
  { 
    id: 4, 
    title: 'How to reduce unnecessary expenses? [REPORTED]', 
    content: 'Content here',
    author: { id: 4, email: 'karen@example.com', first_name: 'Karen', last_name: 'Thompson', full_name: 'Karen Thompson', initials: 'KT' },
    category: { id: 1, name: 'Budgeting', slug: 'budgeting', description: 'Budgeting tips', icon: '💰', post_count: 7, created_at: '2026-03-05', updated_at: '2026-03-05' },
    tags: [
      { id: 1, name: 'budgeting', slug: 'budgeting', created_at: '2026-03-05' },
      { id: 2, name: 'discussion', slug: 'discussion', created_at: '2026-03-05' }
    ],
    status: 'reported',
    views_count: 215,
    comment_count: 7,
    like_count: 3,
    is_pinned: false,
    is_locked: true,
    is_liked: false,
    created_at: '2026-03-05',
    updated_at: '2026-03-05',
    authorName: 'Karen Thompson',
    authorInitials: 'KT',
    date: 'Mar 5, 2026',
    comments: 7
  },
];

export const CommunityForum = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Community Forum</h1>
        <p className="text-sm text-gray-500">Admin Dashboard &gt; Community Forum</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       
        <StatsCard title="Total Posts" value="1,847" trend="+5% since last month" icon={"📄"} />
        <StatsCard title="Active Users" value="1,200" trend="+10% since last week" icon={"👥"} />
        <StatsCard title="Reported Items" value="1" trend="Urgent attention" icon={"🚩"} isUrgent />
      </div>

      <FilterBar 
        searchTerm=""
        onSearchChange={() => {}}
        selectedStatus="all"
        onStatusChange={() => {}}
        selectedCategory="all"
        onCategoryChange={() => {}}
        categories={[]}
        categoriesLoading={false}
      />
      <PostTable posts={MOCK_DATA} onDeletePost={() => {}} />
    </div>
  );
};