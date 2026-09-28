"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const navLinks = [
  { name: "Capabilities", href: "#features" },
  { name: "Process", href: "#how-it-works" },
  { name: "Infrastructure", href: "#infra" },
  { name: "Integrations", href: "#integrations" },
  { name: "Security", href: "#security" },
];

function Avatar({
  src,
  name,
  size = 36,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "U").charAt(0).toUpperCase();

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name || "Profile"}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="rounded-full bg-white/15 text-white flex items-center justify-center text-sm font-medium"
      style={{ width: size, height: size }}
    >
      {initial}
    </span>
  );
}

function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="rounded-full ring-1 ring-white/20 hover:ring-white/50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <Avatar src={user.photoURL} name={user.displayName || user.email} />
      </button>

      {/* Glass modal */}
      <div
        role="menu"
        className={`absolute right-0 top-full mt-3 w-64 origin-top-right rounded-2xl border border-white/15 bg-black/40 backdrop-blur-2xl shadow-2xl p-4 text-white transition-all duration-200 ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <Avatar src={user.photoURL} name={user.displayName || user.email} size={44} />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.displayName || "User"}</p>
            <p className="text-xs text-white/50 truncate">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          role="menuitem"
          onClick={async () => {
            setOpen(false);
            await logout();
          }}
          className="mt-3 w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signInWithGoogle, logout } = useAuth();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const targetId = href.replace("#", "");
    if (!targetId) return;

    e.preventDefault();

    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-350"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span
              className={`font-display tracking-tight transition-all duration-500 ${
                isScrolled ? "text-xl text-foreground" : "text-2xl text-white"
              }`}
            >
              NEXORA
            </span>

            <span
              className={`font-mono transition-all duration-500 ${
                isScrolled
                  ? "text-[10px] mt-0.5 text-muted-foreground"
                  : "text-xs mt-1 text-white/60"
              }`}
            >
              TM
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={`text-sm transition-colors duration-300 relative group ${
                  isScrolled
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.name}

                <span
                  className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                    isScrolled ? "bg-foreground" : "bg-white"
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Desktop CTA: dynamic */}
          <div className="hidden md:flex items-center gap-4 min-w-9 justify-end">
            {loading ? (
              <span className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <ProfileMenu />
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className={`transition-all duration-500 ${
                  isScrolled
                    ? "text-xs text-foreground/70 hover:text-foreground"
                    : "text-sm text-white/70 hover:text-white"
                }`}
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors duration-500 ${
              isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleSmoothScroll(e, link.href);
                }}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms",
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Bottom CTA: dynamic */}
          <div
            className={`pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            {user ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={user.photoURL} name={user.displayName || user.email} size={44} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.displayName || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await logout();
                  }}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full rounded-full h-14 text-base"
                onClick={async () => {
                  setIsMobileMenuOpen(false);
                  await signInWithGoogle();
                }}
              >
                Sign in with Google
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}