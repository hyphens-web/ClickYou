"use client"

import Link from "next/link"
import { Logo } from "./logo"

export function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between"
        style={{
          borderBottom: "1px solid oklch(0.22 0.015 265 / 0.5)",
          background: "oklch(0.09 0.005 265 / 0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" aria-label="ClickYou — Home">
          <Logo size="sm" />
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6 text-sm text-muted-foreground">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-200"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="#"
                className="px-4 py-2 rounded-lg text-foreground text-sm font-medium transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "oklch(0.18 0.01 265)",
                  border: "1px solid oklch(0.22 0.015 265)",
                }}
              >
                API
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
