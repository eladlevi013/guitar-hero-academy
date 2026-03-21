"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountMenu from "@/components/AccountMenu";

const NAV_ITEMS = [
  {
    href: "/daily",
    label: "Daily",
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L9.4 6.2H14L10.3 8.8L11.7 13L8 10.4L4.3 13L5.7 8.8L2 6.2H6.6L8 2Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: "/practice",
    label: "Practice",
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M2 12 C2 12 4 10 6 10 C8 10 8 8 10 8 C12 8 14 6 14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="6" r="1.5" fill="currentColor"/>
        <path d="M2 14h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
  {
    href: "/library",
    label: "Songs",
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M6 2v9.5a2.5 2.5 0 1 1-1.5-2.3V4.5L13 3v7a2.5 2.5 0 1 1-1.5-2.3V2L6 2Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: "/player",
    label: "Profile",
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function FloatingNav() {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        top: 14,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(6, 3, 18, 0.86)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 999,
        padding: "5px 6px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset",
        whiteSpace: "nowrap",
      }}
    >
      {/* App name */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: 14,
          padding: "6px 12px 6px 10px",
          color: "#f0e8d8",
          letterSpacing: "-0.02em",
        }}
      >
        Fret Fire
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

      {/* Nav items */}
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active =
          pathname === href ||
          (href === "/practice" && pathname.startsWith("/practice")) ||
          (href === "/library" && pathname.startsWith("/library"));
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 13px",
              borderRadius: 999,
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.01em",
              transition: "background 0.15s ease, color 0.15s ease",
              background: active ? "rgba(200,85,61,0.18)" : "transparent",
              color: active ? "#ff9a7e" : "rgba(240,232,216,0.48)",
              outline: active ? "1px solid rgba(200,85,61,0.22)" : "1px solid transparent",
            }}
          >
            {icon}
            {label}
          </Link>
        );
      })}

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

      {/* Account */}
      <div style={{ paddingLeft: 4 }}>
        <AccountMenu compact />
      </div>
    </div>
  );
}
