"use client"

import Link from "next/link"
import {
  NavigationMenu, NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

export function Navbar() {
  return (
    <div className="w-full flex justify-center py-4 border-b">
      <NavigationMenu>
        <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">Dashboard</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/table">Table</Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}