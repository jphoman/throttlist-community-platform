export interface User {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  bio?: string
  location?: string
  instagramHandle?: string
  youtubeHandle?: string
  proTier: string | number
  affiliateDisclosureDismissed: string | number
  createdAt: string
}

export interface Build {
  id: string
  userId: string
  year: number
  make: string
  model: string
  nickname: string
  slug: string
  coverPhotoUrl: string
  tags: string // JSON array string
  followerCount: number
  tagVisibility: string // JSON object string
  status: string
  archivedPublic: string | number
  createdAt: string
  // joined
  username?: string
  displayName?: string
  avatarUrl?: string
  ownerIsPro?: boolean
}

export interface Part {
  id: string
  buildId: string
  name: string
  category: string
  type: 'linkable' | 'reference' | 'service'
  sourceUrl?: string
  notes?: string
  isCurrent: string | number
  replacedByPartId?: string
  createdAt: string
}

export interface Post {
  id: string
  buildId: string
  userId: string
  photos: string // JSON array string
  caption: string
  taggedPartIds: string // JSON array string
  likeCount: number
  commentCount: number
  createdAt: string
  // joined
  username?: string
  displayName?: string
  avatarUrl?: string
  buildNickname?: string
  buildSlug?: string
  buildYear?: number
  buildMake?: string
  buildModel?: string
  buildCoverPhotoUrl?: string
}

export interface Comment {
  id: string
  body: string
  authorUserId: string
  parentId?: string
  likes: number
  targetType: string
  targetId: string
  isPinned: string | number
  createdAt: string
  // joined
  username?: string
  displayName?: string
  avatarUrl?: string
}

export interface Tag {
  name: string
  description?: string
  followerCount: number
  buildCount: number
}

export interface Message {
  id: string
  senderUserId: string
  recipientUserId: string
  body: string
  read: string | number
  createdAt: string
  // joined
  senderUsername?: string
  senderAvatarUrl?: string
  recipientUsername?: string
  recipientAvatarUrl?: string
}
