"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/docs", label: "Methodology" },
  { href: "/about", label: "About Us" },
];

const NavLink = ({
  children,
  href,
  active,
  onClick,
  className,
  isMobile = false,
}: {
  children: React.ReactNode;
  href: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
  isMobile?: boolean;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center transition-all duration-200 font-medium",
        isMobile
          ? cn(
              "text-base py-1 px-2 text-center",
              active ? "text-white font-semibold" : "text-white/85 hover:text-white"
            )
          : cn(
              "text-sm px-4 py-1.5 rounded-full",
              active ? "text-white bg-white/20 font-semibold" : "text-white/80 hover:text-white"
            ),
        "before:pointer-events-none before:absolute before:bottom-1 before:h-[1px] before:bg-white before:content-['']",
        isMobile ? "before:left-2 before:right-2" : "before:left-4 before:right-4",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        active ? "" : "hover:before:origin-left hover:before:scale-x-100",
        className
      )}
    >
      <span>{children}</span>
      <svg
        className={cn(
          "ml-[0.3em] mt-[0.1em] size-[0.55em] transition-all duration-300 [motion-reduce:transition-none] motion-reduce:transition-none",
          active 
            ? "translate-y-0 opacity-100 text-white" 
            : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 text-white/80 group-hover:text-white"
        )}
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </Link>
  );
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    // Sync initial hash
    setHash(window.location.hash);

    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      if (pathname !== "/") return false;
      const targetHash = href.replace("/", ""); // e.g., "#features"
      if (!hash) {
        return href === "/#features"; // default to first item on homepage
      }
      return hash === targetHash;
    }
    return pathname === href;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-black/45 to-transparent pointer-events-auto">
        {/* Left: Brand Logo & Typography */}
        <Link href="/" className="flex items-center gap-2 group pointer-events-auto">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 ring-1 ring-white/5 group-hover:bg-[#e8702a]/10 group-hover:border-[#e8702a]/30 transition-all duration-300">
            <Leaf className="h-[15px] w-[15px] text-[#e8702a] fill-[#e8702a]/10" />
          </div>
          <span className="text-white text-2xl font-playfair italic transition-colors group-hover:text-neutral-200">
            DeepGreen
          </span>
        </Link>

        {/* Center Pill Navigation (Desktop Only) */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-1.5 items-center gap-1 pointer-events-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              active={isActive(link.href)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Action Button (Desktop Only) */}
        <div className="hidden md:block pointer-events-auto">
          <Link 
            href="/dashboard" 
            className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors inline-block"
          >
            Launch Sandbox
          </Link>
        </div>

        {/* Mobile Hamburger menu */}
        <button 
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-white hover:text-neutral-300 transition-colors focus:outline-none cursor-pointer z-[101]"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Dropdown Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-90 md:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4 text-center">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.href} 
                  href={link.href}
                  active={isActive(link.href)}
                  isMobile={true}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <Link 
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="w-full bg-white text-neutral-900 font-semibold py-3 rounded-full text-sm text-center inline-block"
            >
              Launch Sandbox
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default Navbar;
