import {
  LayoutDashboard,
  CloudSun,
  TrendingUp,
  Leaf,
  MessageSquare,
  FileText,
  Wallet,
  Settings,
  type LucideProps,
} from "lucide-react"
import type {
  ForwardRefExoticComponent,
  RefAttributes,
} from "react"

type NavigationItem = {
  name: string
  href: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export const navItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  { name: "Weather & Climate", href: "/#", icon: CloudSun },
  { name: "Market Prices", href: "/#", icon: TrendingUp },
  { name: "Crop Management", href: "/#", icon: Leaf },
  { name: "Expert Advice", href: "/#", icon: MessageSquare },
  { name: "Records", href: "/#", icon: FileText },
  { name: "Funding", href: "/funding", icon: Wallet },
  { name: "Settings", href: "/#", icon: Settings },
]
