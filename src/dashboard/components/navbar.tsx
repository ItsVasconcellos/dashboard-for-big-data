// components/main-nav.tsx
"use client" // <--- This is the key

import * as React from "react"
import Link from "next/link"

// Import shadcn components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  return (
    <div className="w-full flex justify-center py-4 border-b">
      <NavigationMenu>
        <NavigationMenuList>
          
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* Example Item 2 */}
          <NavigationMenuItem>
            <Link href="/table" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Table
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}