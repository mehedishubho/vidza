"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex mx-auto h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="h-6 w-6" />
          <span className="text-lg font-bold">Vidza</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-white/80"
          >
            Home
          </Link>
          <Link
            href="#platforms"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white/80"
          >
            Platforms
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white/80"
          >
            Features
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button size="sm" variant="secondary" asChild>
            <Link href="https://github.com" target="_blank">
              Support
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
