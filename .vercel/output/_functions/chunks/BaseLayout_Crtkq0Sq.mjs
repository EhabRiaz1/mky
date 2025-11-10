import { e as createComponent, f as createAstro, h as addAttribute, n as renderHead, k as renderComponent, o as renderSlot, l as renderScript, r as renderTemplate } from './astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
/* empty css                         */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2e3);
    return () => clearTimeout(timer);
  }, []);
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isLoading && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.8, ease: "easeInOut" },
      className: "fixed inset-0 z-50 flex items-center justify-center",
      style: {
        background: "var(--brand-bg-exact)",
        height: "100%",
        width: "100%",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2, filter: "blur(20px)" },
          transition: { duration: 0.7 },
          className: "flex items-center justify-center",
          children: /* @__PURE__ */ jsxs("div", { className: "w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center relative", children: [
            /* @__PURE__ */ jsx("div", { className: "w-32 h-32 sm:w-48 sm:h-48 relative", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo.png",
                alt: "Maison MKY",
                className: "w-full h-full object-contain",
                style: {
                  opacity: 0.95,
                  maskImage: "radial-gradient(circle, black 65%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(circle, black 65%, transparent 100%)"
                },
                onError: (e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement?.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector(".logo-fallback");
                    if (fallback) fallback.style.display = "block";
                  }
                }
              }
            ) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "logo-fallback text-[#F3E7DF] font-light tracking-widest text-3xl absolute",
                style: { display: "none" },
                children: "MAISON MKY"
              }
            )
          ] })
        }
      )
    }
  ) });
}

const supabase = createClient(
  "https://apkohkqyebipmzvdwxgr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwa29oa3F5ZWJpcG16dmR3eGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODQwNDgsImV4cCI6MjA3NDU2MDA0OH0.eEvBZRf_sFDKThtjg9PxqDiK-N4eGkhxpf3W8DNqHQs"
);
function AuthDrawerIsland({ variant }) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      const u = data?.user || null;
      setUser(u);
      if (u) {
        try {
          const { data: profile } = await supabase.from("profiles").select("display_name, first_name, last_name").eq("id", u.id).single();
          const name = profile?.display_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || u?.user_metadata?.full_name || u.email;
          setDisplayName((name || "").trim() || null);
        } catch {
        }
      }
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);
  async function signOut() {
    await supabase.auth.signOut();
    location.reload();
  }
  const textColor = variant === "desktop" ? "text-[var(--brand-bg-exact)]" : "text-[var(--brand-ink-exact)]";
  const subtle = variant === "desktop" ? "text-[rgba(38,19,21,0.7)]" : "text-[rgba(243,231,223,0.8)]";
  const border = variant === "desktop" ? "border-[rgba(38,19,21,0.1)]" : "border-[rgba(243,231,223,0.1)]";
  if (loading) return null;
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: `pt-6 border-t ${border}`, children: [
      /* @__PURE__ */ jsx("div", { className: `${subtle} mb-3 text-sm tracking-wider uppercase`, style: { fontFamily: "Inter, sans-serif" }, children: "Account" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("a", { href: "/login", className: `${textColor} underline-offset-4 hover:underline`, style: { fontFamily: "Inter, sans-serif" }, children: "Sign in" }),
        /* @__PURE__ */ jsx("a", { href: "/signup", className: `${textColor} underline-offset-4 hover:underline`, style: { fontFamily: "Inter, sans-serif" }, children: "Create account" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: `pt-6 border-t ${border}`, children: [
    /* @__PURE__ */ jsx("div", { className: `${subtle} text-sm tracking-wider uppercase mb-1`, style: { fontFamily: "Inter, sans-serif" }, children: "Account" }),
    /* @__PURE__ */ jsxs("div", { className: `${textColor} mb-3`, style: { fontFamily: "Inter, sans-serif" }, children: [
      "Welcome back, ",
      displayName || "Friend"
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: signOut, className: "btn btn-outline", children: "Sign out" })
  ] });
}

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "MKY - The Lifestyle",
    description = "Luxury Fashion House",
    stickyHeader = false,
    fullWidth = false
  } = Astro2.props;
  const isHome = Astro2.url.pathname === "/";
  const useStickyHeader = !isHome && stickyHeader;
  const stickyBackground = "rgba(38, 19, 21, 0.98)";
  const applyStickyColor = !isHome || useStickyHeader;
  const headerBackground = applyStickyColor ? stickyBackground : "transparent";
  const headerPositionClasses = useStickyHeader ? "sticky top-0 left-0 right-0" : "fixed top-0 left-0 right-0";
  const headerEffectClasses = applyStickyColor ? "backdrop-blur-md" : "";
  const headerTextClasses = applyStickyColor ? "text-[var(--brand-ink-exact)]" : "";
  const shouldOffsetForHeader = !isHome && !useStickyHeader;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="description"${addAttribute(description, "content")}><link rel="icon" type="image/png" href="/logo.png"><link rel="preload" href="/logo.png" as="image" type="image/png"><title>${title}</title>${renderHead()}</head> <body class="min-h-screen text-neutral-900"${addAttribute({ backgroundColor: "var(--brand-ink-exact)" }, "style")}> ${renderComponent($$result, "LoadingScreen", LoadingScreen, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/LoadingScreen", "client:component-export": "default" })} <div class="page-content"> <header id="main-header"${addAttribute(`${headerPositionClasses} ${headerEffectClasses} ${headerTextClasses} z-40 transition-all duration-300`, "class")}${addAttribute({ backgroundColor: headerBackground }, "style")}> <div class="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between transition-all duration-300"> <!-- Left: Menu + Search (Desktop) --> <div class="hidden md:flex items-center gap-8"> <button id="desktop-menu-button" type="button" onclick="(function(){var d=document.getElementById('desktop-drawer');var o=document.getElementById('desktop-overlay');if(!d||!o)return;d.classList.remove('-translate-x-full');d.classList.add('translate-x-0');o.classList.remove('opacity-0','pointer-events-none');o.classList.add('opacity-100');document.body.style.overflow='hidden';})()" class="group inline-flex items-center gap-2 text-base tracking-wider transition-opacity hover:opacity-70"${addAttribute({ color: "var(--brand-ink-exact)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", fontSize: "0.875rem", letterSpacing: "0.1em" }, "style")} aria-label="Menu"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16"></path> </svg> <span class="relative inline-block group-hover:font-semibold">Menu
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </button> <a href="/search" class="group text-base tracking-wider transition-opacity hover:opacity-70"${addAttribute({ color: "var(--brand-ink-exact)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", fontSize: "0.875rem", letterSpacing: "0.1em" }, "style")}> <span class="relative inline-block group-hover:font-semibold">Search
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> </div> <!-- Center: Logo --> <div id="logo-target" class="w-10 md:w-12 h-10 md:h-12"> <a href="/" class="block w-full h-full"> <img src="/logo.png" alt="MKY" class="w-full h-full object-contain"> </a> </div> <!-- Mobile menu button --> <button id="mobile-menu-button" type="button" onclick="(function(){var d=document.getElementById('mobile-drawer');var o=document.getElementById('mobile-overlay');if(!d||!o)return;d.classList.remove('translate-x-full');d.classList.add('translate-x-0');o.classList.remove('opacity-0','pointer-events-none');o.classList.add('opacity-100');document.body.style.overflow='hidden';})()" class="md:hidden text-[#F3E7DF] z-50" aria-label="Toggle menu"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> <!-- Right: Utility Nav (Desktop) --> <nav class="hidden md:flex items-center gap-8 text-sm"> <form action="/" method="get" class="inline"> <select name="currency" class="border-none bg-transparent text-sm tracking-wider"${addAttribute({ color: "var(--brand-ink-exact)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", fontSize: "0.875rem", letterSpacing: "0.1em" }, "style")} onChange="document.cookie='mky_currency='+this.value+'; Path=/; Max-Age=31536000'; location.reload()"> <option value="GBP">GBP</option> <option value="EUR">EUR</option> </select> </form> <a href="/cart" class="group tracking-wider transition-opacity hover:opacity-70"${addAttribute({ color: "var(--brand-ink-exact)", fontFamily: "Inter, sans-serif", textTransform: "uppercase", fontSize: "0.875rem", letterSpacing: "0.1em" }, "style")}> <span class="relative inline-block group-hover:font-semibold">Cart
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> </nav> </div> </header> <!-- Drawers and overlays mounted outside header to avoid stacking/context issues --> <!-- Desktop mega menu drawer (slides in from left) --> <div id="desktop-drawer" class="hidden md:block fixed inset-y-0 left-0 z-[1000] w-96 bg-[rgba(243,231,223,0.98)] backdrop-blur-lg shadow-2xl transition-transform duration-300 ease-in-out transform -translate-x-full"> <div class="h-full flex flex-col px-10 py-12 overflow-y-auto"> <!-- Close button --> <button id="close-desktop-drawer" type="button" onclick="(function(){var d=document.getElementById('desktop-drawer');var o=document.getElementById('desktop-overlay');if(!d||!o)return;d.classList.remove('translate-x-0');d.classList.add('-translate-x-full');o.classList.remove('opacity-100');o.classList.add('opacity-0','pointer-events-none');document.body.style.overflow='';})()" class="absolute top-8 right-8 transition-opacity hover:opacity-70"${addAttribute({ color: "var(--brand-bg-exact)" }, "style")} aria-label="Close menu"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> <!-- Main menu --> <nav class="mt-16 flex flex-col gap-6"> <!-- Men Dropdown --> <div class="border-b border-[rgba(38,19,21,0.1)] pb-6"> <button type="button" aria-expanded="false" onclick="(function(btn){var id=btn.getAttribute('data-target');var s=document.getElementById(id);var c=btn.querySelector('.drawer-chevron');if(!s)return;var hidden=s.classList.contains('hidden');if(hidden){s.classList.remove('hidden');if(c){c.style.transform='rotate(180deg)';}btn.setAttribute('aria-expanded','true');}else{s.classList.add('hidden');if(c){c.style.transform='rotate(0deg)';}btn.setAttribute('aria-expanded','false');}})(this)" class="drawer-toggle group w-full flex items-center justify-between py-2 text-left" data-target="men-submenu"> <span class="relative inline-block text-xl tracking-wide group-hover:font-semibold"${addAttribute({ color: "var(--brand-bg-exact)", fontFamily: "Playfair Display, serif" }, "style")}>Men
<span class="block h-[2px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> <svg class="drawer-chevron h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path> </svg> </button> <div id="men-submenu" class="drawer-submenu hidden mt-3 ml-4 flex flex-col gap-3"> <a href="/men/blazers" class="group text-base transition-opacity hover:opacity-70"${addAttribute({ color: "rgba(38,19,21,0.7)", fontFamily: "Inter, sans-serif" }, "style")}> <span class="relative inline-block group-hover:font-medium">Blazers
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> <a href="/men/trousers" class="group text-base transition-opacity hover:opacity-70"${addAttribute({ color: "rgba(38,19,21,0.7)", fontFamily: "Inter, sans-serif" }, "style")}> <span class="relative inline-block group-hover:font-medium">Trousers
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> <a href="/men" class="group text-base transition-opacity hover:opacity-70"${addAttribute({ color: "rgba(38,19,21,0.7)", fontFamily: "Inter, sans-serif" }, "style")}> <span class="relative inline-block group-hover:font-medium">View All Men's
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> </div> </div> <!-- Women Dropdown --> <div class="border-b border-[rgba(38,19,21,0.1)] pb-6"> <button type="button" aria-expanded="false" onclick="(function(btn){var id=btn.getAttribute('data-target');var s=document.getElementById(id);var c=btn.querySelector('.drawer-chevron');if(!s)return;var hidden=s.classList.contains('hidden');if(hidden){s.classList.remove('hidden');if(c){c.style.transform='rotate(180deg)';}btn.setAttribute('aria-expanded','true');}else{s.classList.add('hidden');if(c){c.style.transform='rotate(0deg)';}btn.setAttribute('aria-expanded','false');}})(this)" class="drawer-toggle group w-full flex items-center justify-between py-2 text-left" data-target="women-submenu"> <span class="relative inline-block text-xl tracking-wide group-hover:font-semibold"${addAttribute({ color: "var(--brand-bg-exact)", fontFamily: "Playfair Display, serif" }, "style")}>Women
<span class="block h-[2px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> <svg class="drawer-chevron h-5 w-5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path> </svg> </button> <div id="women-submenu" class="drawer-submenu hidden mt-3 ml-4 flex flex-col gap-3"> <a href="/women/blazers" class="group text-base transition-opacity hover:opacity-70"${addAttribute({ color: "rgba(38,19,21,0.7)", fontFamily: "Inter, sans-serif" }, "style")}> <span class="relative inline-block group-hover:font-medium">Blazers
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> <a href="/women/trousers" class="group text-base transition-opacity hover:opacity-70"${addAttribute({ color: "rgba(38,19,21,0.7)", fontFamily: "Inter, sans-serif" }, "style")}> <span class="relative inline-block group-hover:font-medium">Trousers
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> <a href="/women" class="group text-base transition-opacity hover:opacity-70"${addAttribute({ color: "rgba(38,19,21,0.7)", fontFamily: "Inter, sans-serif" }, "style")}> <span class="relative inline-block group-hover:font-medium">View All Women's
<span class="block h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> </div> </div> <!-- Single Links --> <a href="/products" class="group py-3 text-xl tracking-wide transition-opacity hover:opacity-70 border-b border-[rgba(38,19,21,0.1)]"${addAttribute({ color: "var(--brand-bg-exact)", fontFamily: "Playfair Display, serif" }, "style")}> <span class="relative inline-block group-hover:font-semibold">Explore the Collection
<span class="block h-[2px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> <a href="/products" class="group py-3 text-xl tracking-wide transition-opacity hover:opacity-70 border-b border-[rgba(38,19,21,0.1)]"${addAttribute({ color: "var(--brand-bg-exact)", fontFamily: "Playfair Display, serif" }, "style")}> <span class="relative inline-block group-hover:font-semibold">New Arrivals
<span class="block h-[2px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> <a href="/sustainability" class="group py-3 text-xl tracking-wide transition-opacity hover:opacity-70 border-b border-[rgba(38,19,21,0.1)]"${addAttribute({ color: "var(--brand-bg-exact)", fontFamily: "Playfair Display, serif" }, "style")}> <span class="relative inline-block group-hover:font-semibold">Sustainability
<span class="block h-[2px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> <a href="/our-story" class="group py-3 text-xl tracking-wide transition-opacity hover:opacity-70 border-b border-[rgba(38,19,21,0.1)]"${addAttribute({ color: "var(--brand-bg-exact)", fontFamily: "Playfair Display, serif" }, "style")}> <span class="relative inline-block group-hover:font-semibold">Our Story
<span class="block h-[2px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"></span> </span> </a> </nav> <div class="mt-auto"> ${renderComponent($$result, "AuthDrawerIsland", AuthDrawerIsland, { "variant": "desktop", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/react/AuthDrawerIsland", "client:component-export": "default" })} </div> </div> </div> <!-- Mobile drawer menu (slides in from right) --> <div id="mobile-drawer" class="md:hidden fixed inset-y-0 right-0 z-[1000] w-[85vw] max-w-md bg-[rgba(38,19,21,0.98)] backdrop-blur-lg shadow-lg transition-transform duration-300 ease-in-out transform translate-x-full"> <div class="h-full flex flex-col justify-between px-8 py-10 overflow-y-auto"> <!-- Close button --> <button id="close-drawer-button" type="button" onclick="(function(){var d=document.getElementById('mobile-drawer');var o=document.getElementById('mobile-overlay');if(!d||!o)return;d.classList.remove('translate-x-0');d.classList.add('translate-x-full');o.classList.remove('opacity-100');o.classList.add('opacity-0','pointer-events-none');document.body.style.overflow='';})()" class="absolute top-6 right-6 text-[var(--brand-ink-exact)]" aria-label="Close menu"> <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> <!-- Main menu --> <div class="mt-16"> <nav class="flex flex-col gap-6"> <!-- Men Dropdown --> <div class="border-b border-[rgba(243,231,223,0.1)] pb-6"> <button type="button" aria-expanded="false" onclick="(function(btn){var id=btn.getAttribute('data-target');var s=document.getElementById(id);var c=btn.querySelector('.drawer-chevron');if(!s)return;var hidden=s.classList.contains('hidden');if(hidden){s.classList.remove('hidden');if(c){c.style.transform='rotate(180deg)';}btn.setAttribute('aria-expanded','true');}else{s.classList.add('hidden');if(c){c.style.transform='rotate(0deg)';}btn.setAttribute('aria-expanded','false');}})(this)" class="drawer-toggle w-full flex items-center justify-between py-2 text-left" data-target="mobile-men-submenu"> <span class="text-2xl tracking-wide text-[var(--brand-ink-exact)]"${addAttribute({ fontFamily: "Playfair Display, serif" }, "style")}>Men</span> <svg class="drawer-chevron h-5 w-5 text-[var(--brand-ink-exact)] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path> </svg> </button> <div id="mobile-men-submenu" class="drawer-submenu hidden mt-4 ml-4 flex flex-col gap-3"> <a href="/men/blazers" class="text-base hover:opacity-70 transition-opacity"${addAttribute({ color: "rgba(243,231,223,0.8)", fontFamily: "Inter, sans-serif" }, "style")}>Blazers</a> <a href="/men/trousers" class="text-base hover:opacity-70 transition-opacity"${addAttribute({ color: "rgba(243,231,223,0.8)", fontFamily: "Inter, sans-serif" }, "style")}>Trousers</a> <a href="/men" class="text-base hover:opacity-70 transition-opacity"${addAttribute({ color: "rgba(243,231,223,0.8)", fontFamily: "Inter, sans-serif" }, "style")}>View All Men's</a> </div> </div> <!-- Women Dropdown --> <div class="border-b border-[rgba(243,231,223,0.1)] pb-6"> <button type="button" aria-expanded="false" onclick="(function(btn){var id=btn.getAttribute('data-target');var s=document.getElementById(id);var c=btn.querySelector('.drawer-chevron');if(!s)return;var hidden=s.classList.contains('hidden');if(hidden){s.classList.remove('hidden');if(c){c.style.transform='rotate(180deg)';}btn.setAttribute('aria-expanded','true');}else{s.classList.add('hidden');if(c){c.style.transform='rotate(0deg)';}btn.setAttribute('aria-expanded','false');}})(this)" class="drawer-toggle w-full flex items-center justify-between py-2 text-left" data-target="mobile-women-submenu"> <span class="text-2xl tracking-wide text-[var(--brand-ink-exact)]"${addAttribute({ fontFamily: "Playfair Display, serif" }, "style")}>Women</span> <svg class="drawer-chevron h-5 w-5 text-[var(--brand-ink-exact)] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path> </svg> </button> <div id="mobile-women-submenu" class="drawer-submenu hidden mt-4 ml-4 flex flex-col gap-3"> <a href="/women/blazers" class="text-base hover:opacity-70 transition-opacity"${addAttribute({ color: "rgba(243,231,223,0.8)", fontFamily: "Inter, sans-serif" }, "style")}>Blazers</a> <a href="/women/trousers" class="text-base hover:opacity-70 transition-opacity"${addAttribute({ color: "rgba(243,231,223,0.8)", fontFamily: "Inter, sans-serif" }, "style")}>Trousers</a> <a href="/women" class="text-base hover:opacity-70 transition-opacity"${addAttribute({ color: "rgba(243,231,223,0.8)", fontFamily: "Inter, sans-serif" }, "style")}>View All Women's</a> </div> </div> <!-- Single Links --> <a href="/products" class="py-3 text-2xl tracking-wide text-[var(--brand-ink-exact)] hover:opacity-80 transition-opacity border-b border-[rgba(243,231,223,0.1)]"${addAttribute({ fontFamily: "Playfair Display, serif" }, "style")}>Explore the Collection</a> <a href="/products" class="py-3 text-2xl tracking-wide text-[var(--brand-ink-exact)] hover:opacity-80 transition-opacity border-b border-[rgba(243,231,223,0.1)]"${addAttribute({ fontFamily: "Playfair Display, serif" }, "style")}>New Arrivals</a> <a href="/sustainability" class="py-3 text-2xl tracking-wide text-[var(--brand-ink-exact)] hover:opacity-80 transition-opacity border-b border-[rgba(243,231,223,0.1)]"${addAttribute({ fontFamily: "Playfair Display, serif" }, "style")}>Sustainability</a> <a href="/our-story" class="py-3 text-2xl tracking-wide text-[var(--brand-ink-exact)] hover:opacity-80 transition-opacity border-b border-[rgba(243,231,223,0.1)]"${addAttribute({ fontFamily: "Playfair Display, serif" }, "style")}>Our Story</a> <a href="/search" class="py-3 text-2xl tracking-wide text-[var(--brand-ink-exact)] hover:opacity-80 transition-opacity border-b border-[rgba(243,231,223,0.1)]"${addAttribute({ fontFamily: "Playfair Display, serif" }, "style")}>Search</a> <a href="/cart" class="py-3 text-2xl tracking-wide text-[var(--brand-ink-exact)] hover:opacity-80 transition-opacity border-b border-[rgba(243,231,223,0.1)]"${addAttribute({ fontFamily: "Playfair Display, serif" }, "style")}>Cart</a> </nav> </div> <div class="mt-auto"> ${renderComponent($$result, "AuthDrawerIsland", AuthDrawerIsland, { "variant": "mobile", "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/react/AuthDrawerIsland", "client:component-export": "default" })} <!-- Currency selector at bottom --> <div class="pb-8 border-t border-[rgba(243,231,223,0.1)] pt-6"> <div class="text-[var(--brand-ink-exact)] mb-3 text-sm tracking-wider uppercase"${addAttribute({ fontFamily: "Inter, sans-serif" }, "style")}>Currency</div> <form action="/" method="get"> <select name="currency" class="w-full border-none bg-transparent text-base text-[var(--brand-ink-exact)]"${addAttribute({ fontFamily: "Inter, sans-serif" }, "style")} onChange="document.cookie='mky_currency='+this.value+'; Path=/; Max-Age=31536000'; location.reload()"> <option value="GBP">GBP</option> <option value="EUR">EUR</option> </select> </form> </div> </div> </div> </div> <!-- Overlay backdrop for drawers --> <div id="mobile-overlay" onclick="(function(){var d=document.getElementById('mobile-drawer');var o=document.getElementById('mobile-overlay');if(!d||!o)return;d.classList.remove('translate-x-0');d.classList.add('translate-x-full');o.classList.remove('opacity-100');o.classList.add('opacity-0','pointer-events-none');document.body.style.overflow='';})()" class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[900] opacity-0 pointer-events-none transition-opacity duration-300"></div> <div id="desktop-overlay" onclick="(function(){var d=document.getElementById('desktop-drawer');var o=document.getElementById('desktop-overlay');if(!d||!o)return;d.classList.remove('translate-x-0');d.classList.add('-translate-x-full');o.classList.remove('opacity-100');o.classList.add('opacity-0','pointer-events-none');document.body.style.overflow='';})()" class="hidden md:block fixed inset-0 bg-black/30 backdrop-blur-sm z-[900] opacity-0 pointer-events-none transition-opacity duration-300"></div> <!-- Add padding to account for fixed header (not on home page) --> ${shouldOffsetForHeader && renderTemplate`<div class="h-16 md:h-20"></div>`} <main${addAttribute(`${fullWidth ? "max-w-none px-0 py-0" : "max-w-[1920px] mx-auto px-4 md:px-6 py-6 md:py-8"}`, "class")}> ${renderSlot($$result, $$slots["default"])} </main> <footer class="border-t border-neutral-700/10 py-16 mt-24"${addAttribute({ backgroundColor: "var(--brand-bg-exact)" }, "style")}> <div class="max-w-7xl mx-auto px-6"> <div class="grid grid-cols-1 md:grid-cols-4 gap-10"> <div> <h3 class="font-light tracking-widest mb-4 text-[#F3E7DF]"${addAttribute({ color: "var(--brand-ink-exact)" }, "style")}>MKY - The Lifestyle</h3> <p class="text-sm text-[#F3E7DF]/70"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}>Luxury apparel crafted in Italy with the finest materials.</p> </div> <div> <h4 class="font-medium mb-4 text-sm text-[#F3E7DF]"${addAttribute({ color: "var(--brand-ink-exact)" }, "style")}>COLLECTIONS</h4> <ul class="space-y-2 text-sm text-[#F3E7DF]/70"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}> <li><a href="/men" class="hover:text-[#F3E7DF] transition-colors"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}>Men</a></li> <li><a href="/women" class="hover:text-[#F3E7DF] transition-colors"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}>Women</a></li> </ul> </div> <div> <h4 class="font-medium mb-4 text-sm text-[#F3E7DF]"${addAttribute({ color: "var(--brand-ink-exact)" }, "style")}>CUSTOMER CARE</h4> <ul class="space-y-2 text-sm text-[#F3E7DF]/70"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}> <li><a href="/contact" class="hover:text-[#F3E7DF] transition-colors"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}>Contact</a></li> <li><a href="/shipping" class="hover:text-[#F3E7DF] transition-colors"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}>Shipping</a></li> <li><a href="/returns" class="hover:text-[#F3E7DF] transition-colors"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}>Returns</a></li> </ul> </div> <div> <h4 class="font-medium mb-4 text-sm text-[#F3E7DF]"${addAttribute({ color: "var(--brand-ink-exact)" }, "style")}>LEGAL</h4> <ul class="space-y-2 text-sm text-[#F3E7DF]/70"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}> <li><a href="/privacy" class="hover:text-[#F3E7DF] transition-colors"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}>Privacy</a></li> <li><a href="/terms" class="hover:text-[#F3E7DF] transition-colors"${addAttribute({ color: "rgba(243, 231, 223, 0.7)" }, "style")}>Terms</a></li> </ul> </div> </div> <div class="mt-16 pt-8 border-t border-[#F3E7DF]/10 text-sm text-[#F3E7DF]/50"${addAttribute({ color: "rgba(243, 231, 223, 0.5)" }, "style")}>
© ${(/* @__PURE__ */ new Date()).getFullYear()} MKY - The Lifestyle. All rights reserved.
</div> </div> </footer> </div> ${renderScript($$result, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
