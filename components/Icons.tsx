import React from 'react'
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons'
import Svg, { Circle, Path } from 'react-native-svg'

interface IconProps {
  size?: number
  color?: string
  fill?: string
}

export function Home({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="home" size={size} color={color} />
}

export function Compass({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="compass" size={size} color={color} />
}

export function Plus({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="plus" size={size} color={color} />
}

export function Search({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="search" size={size} color={color} />
}

export function User({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="user" size={size} color={color} />
}

export function Bell({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="bell" size={size} color={color} />
}

export function Heart({ size = 24, color = '#000', fill }: IconProps) {
  if (fill && fill !== 'none') {
    return <Ionicons name="heart" size={size} color={fill} />
  }
  return <Feather name="heart" size={size} color={color} />
}

export function MessageCircle({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="message-circle" size={size} color={color} />
}

export function Send({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="send" size={size} color={color} />
}

export function Share2({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="share-2" size={size} color={color} />
}

export function ExternalLink({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="external-link" size={size} color={color} />
}

export function Instagram({ size = 24, color = '#000' }: IconProps) {
  return <FontAwesome5 name="instagram" size={size} color={color} />
}

export function Youtube({ size = 24, color = '#000' }: IconProps) {
  return <FontAwesome5 name="youtube" size={size} color={color} />
}

export function Settings({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="settings" size={size} color={color} />
}

export function ChevronRight({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="chevron-right" size={size} color={color} />
}

export function Star({ size = 24, color = '#000', fill }: IconProps) {
  if (fill && fill !== 'none') {
    return <Ionicons name="star" size={size} color={fill} />
  }
  return <Feather name="star" size={size} color={color} />
}

export function TrendingUp({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="trending-up" size={size} color={color} />
}

export function Tag({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="tag" size={size} color={color} />
}

export function X({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="x" size={size} color={color} />
}

export function ArrowLeft({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="arrow-left" size={size} color={color} />
}

export function Hash({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="hash" size={size} color={color} />
}

export function Users({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="users" size={size} color={color} />
}

export function Wrench({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="tool" size={size} color={color} />
}

export function ShoppingCart({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="shopping-cart" size={size} color={color} />
}

export function Palette({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="droplet" size={size} color={color} />
}

export function DollarSign({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="dollar-sign" size={size} color={color} />
}

export function CheckCircle({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="check-circle" size={size} color={color} />
}

export function UserPlus({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="user-plus" size={size} color={color} />
}

export function Edit2({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="edit-2" size={size} color={color} />
}

export function MoreHorizontal({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="more-horizontal" size={size} color={color} />
}

export function Pin({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="bookmark" size={size} color={color} />
}

export function Trash({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="trash-2" size={size} color={color} />
}

export function Lock({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="lock" size={size} color={color} />
}

export function Globe({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="globe" size={size} color={color} />
}

export function Camera({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="camera" size={size} color={color} />
}

export function Link({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="link" size={size} color={color} />
}

export function Twitter({ size = 24, color = '#000' }: IconProps) {
  return <FontAwesome5 name="twitter" size={size} color={color} />
}

export function Copy({ size = 24, color = '#000' }: IconProps) {
  return <Feather name="copy" size={size} color={color} />
}

export function Zap({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="flash" size={size} color={color} />
}

export function ProBadge({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 144 144">
      <Circle cx="72" cy="72" r="72" fill="red" />
      <Path
        d="M137.58,63.27s2.21-.72,2.06-1.47c-.13-.63-2.21-.08-4.66.35-3.89.68-39.61,8.38-39.61,8.38-.54.13-.73-.17-.79-.39-.26-2.15,2.81-7.95,3.13-11.02.01-.1.02-.2.02-.29,0-.01,0-.02,0-.04.01-1.15-.72-1.39-1.2-1.42-.98.02-2.72.28-5.01.71h0s-.06.01-.18.03c-.65.12-1.36.22-2.08.41-10.48,2.69-29.88,9.25-32.68,9.75-2.54.46-2.07-1.36-1.78-2.11.04-.1.09-.2.13-.3,0,0,0,0,0,0h0c.88-2.04,1.31-4.35,1.83-6.12,0,0,0,0,0,0,1.01-3.51-.58-3.5-.58-3.5-3.28-.27-59.78,29.4-50.84,27.09,8.93-2.31,29.9-6.99,29.9-6.99,0,0,0,0,0,0,.16-.03.77-.06.86.82,0,0-.16,2.08-.8,3.58-.64,1.5-1.63,3.67-1.76,5.33-.01.43.08,1.74,1.75,1.69.12,0,.24-.02.38-.03.03,0,.05,0,.08,0,0,0,11.62-3.39,15.46-5.03,3.84-1.64,30.16-11.72,30.16-11.72,0,0,1.68-.44,1.43,1.26-.04.2-.09.41-.15.63,0,0,0,.02,0,.02-.03.1-.05.18-.07.26-.88,3.23-2.78,7.74-2.27,9.5.08.22.36.65,1.23.53,1.09-.13,3.07-.58,5.7-1.28h0c26.7-10.63,26.87-10.33,50.37-18.63Z"
        fill="#fff"
      />
    </Svg>
  )
}
