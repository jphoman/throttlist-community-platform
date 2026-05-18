// Throttlist design tokens
export const colors = {
  bg: '#0A0A0A',
  surface1: '#1A1A1A',
  surface2: '#2A2A2A',
  surface3: '#3A3A3A',
  accent: '#CC0000',
  accentDim: '#991100',
  textPrimary: '#FFFFFF',
  textSecondary: '#666666',
  textTertiary: '#666666',
  border: '#1A1A1A',
  borderSubtle: '#2A2A2A',
  linkable: '#CC0000',
  reference: '#666666',
  service: '#2A2A2A',
  green: '#16A34A',
  amber: '#BA7517',
}

export const MOCK_USER_ID = 'user_cappuccino'

export const AFFILIATE_TAG = 'tag=throttlist-20&ascsubtag=beta'

export function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return `${Math.floor(diff / 604800)}w`
}

export function buildAffiliateUrl(url: string): string {
  if (!url) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${AFFILIATE_TAG}`
}

export function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

// Fixed Unsplash motorcycle build photos (stable IDs)
export const MOTO_PHOTOS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
  'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=900&q=80',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=900&q=80',
  'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80',
  'https://images.unsplash.com/photo-1558981285-6f0c68243f0f?w=900&q=80',
  'https://images.unsplash.com/photo-1566836584760-7c71e9e1c7f9?w=900&q=80',
  'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=900&q=80',
]
