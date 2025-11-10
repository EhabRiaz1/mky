/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, l as renderScript } from '../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Crtkq0Sq.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

function Reveal({ children }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { y: 24, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.6 },
      children
    }
  );
}

function IntroVideo({
  videoSrc = "/videos/intro.mp4",
  logoSrc = "/logo.png",
  leftWidthVw = 45
}) {
  const containerRef = useRef(null);
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const updateIsDesktop = () => setIsDesktop(window.innerWidth >= 768);
    updateIsDesktop();
    window.addEventListener("resize", updateIsDesktop);
    return () => window.removeEventListener("resize", updateIsDesktop);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.5);
      },
      { threshold: [0, 0.5, 0.75, 1] }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const videoEl = isDesktop ? desktopVideoRef.current : mobileVideoRef.current;
    if (!videoEl) return;
    if (inView && !hasStarted) {
      try {
        videoEl.muted = true;
        const playPromise = videoEl.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.then(() => setHasStarted(true)).catch(() => {
          });
        } else {
          setHasStarted(true);
        }
      } catch {
      }
    }
  }, [inView, hasStarted, isDesktop]);
  const rightInitialLeft = `${leftWidthVw}vw`;
  const rightInitialWidth = `${100 - leftWidthVw}vw`;
  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref: containerRef,
      className: "relative -mx-4 md:-mx-6 my-0",
      style: { marginLeft: "calc(-50vw + 50%)" },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "hidden md:block relative",
            style: { height: "100vh", minHeight: 700 },
            children: /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 h-full", style: { width: `${leftWidthVw}vw` }, children: /* @__PURE__ */ jsx(
                "video",
                {
                  ref: desktopVideoRef,
                  src: videoSrc,
                  playsInline: true,
                  muted: true,
                  preload: "auto",
                  loop: true,
                  className: "absolute inset-0 w-full h-full object-cover object-center"
                }
              ) }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "absolute top-0 h-full flex flex-col items-center justify-center gap-8",
                  style: {
                    left: rightInitialLeft,
                    width: rightInitialWidth,
                    backgroundColor: "var(--brand-bg-exact)"
                  },
                  children: [
                    /* @__PURE__ */ jsx("img", { src: logoSrc, alt: "Maison MKY", className: "w-32 h-32 lg:w-40 lg:h-40 object-contain" }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: handleScrollDown,
                        className: "group px-6 py-3 border border-white/60 hover:border-white transition-all duration-300 rounded-full",
                        style: {
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.875rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "white"
                        },
                        children: /* @__PURE__ */ jsxs("span", { className: "relative inline-block group-hover:font-medium", children: [
                          "Click to Explore",
                          /* @__PURE__ */ jsx("span", { className: "block h-[1px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5" })
                        ] })
                      }
                    )
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "md:hidden relative flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "relative", style: { height: "100vh", minHeight: 560 }, children: /* @__PURE__ */ jsx(
            "video",
            {
              ref: mobileVideoRef,
              src: videoSrc,
              playsInline: true,
              muted: true,
              preload: "auto",
              loop: true,
              className: "absolute inset-0 w-full h-full object-cover object-center"
            }
          ) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex items-center justify-center py-12",
              style: { backgroundColor: "var(--brand-bg-exact)" },
              children: /* @__PURE__ */ jsx("img", { src: logoSrc, alt: "Maison MKY", className: "w-24 h-24 object-contain" })
            }
          )
        ] })
      ]
    }
  );
}

function ServicesBar() {
  const services = [
    {
      title: "Complimentary Shipping",
      description: "Free express delivery on all orders",
      icon: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" }) })
    },
    {
      title: "Personalisation",
      description: "Bespoke monogramming available",
      icon: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) })
    },
    {
      title: "Expert Care",
      description: "Lifetime product care & repairs",
      icon: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) })
    }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "py-16 border-t border-b", style: { borderColor: "rgba(38,19,21,0.1)" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-10 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-light tracking-tight mb-3", style: { color: "var(--brand-bg-exact)" }, children: "Maison MKY Services" }),
      /* @__PURE__ */ jsx("p", { className: "text-base max-w-2xl mx-auto", style: { color: "rgba(38,19,21,0.7)" }, children: "We offer an array of tailored services — including complimentary shipping, bespoke personalisation, and lifetime product care." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12", children: services.map((service, idx) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { delay: idx * 0.1, duration: 0.6 },
        viewport: { once: true },
        className: "text-center",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", style: { color: "var(--brand-bg-exact)" }, children: service.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2 tracking-wide", style: { color: "var(--brand-bg-exact)" }, children: service.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "rgba(38,19,21,0.6)" }, children: service.description })
        ]
      },
      idx
    )) })
  ] });
}

function DareToEnter({ onEnter }) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const hasEnteredSession = sessionStorage.getItem("mky_dare_to_enter_clicked");
    if (!hasEnteredSession) {
      setIsVisible(true);
    }
  }, []);
  const handleEnter = () => {
    sessionStorage.setItem("mky_dare_to_enter_clicked", "true");
    setIsVisible(false);
    onEnter?.();
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isVisible && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.8, ease: "easeInOut" },
      className: "fixed inset-0 z-[100] flex items-center justify-center",
      style: {
        background: "var(--brand-bg-exact)",
        height: "100%",
        width: "100%",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2, filter: "blur(20px)" },
          transition: { duration: 0.7 },
          className: "flex flex-col items-center justify-center gap-8",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center relative", children: [
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
            ] }),
            /* @__PURE__ */ jsx(
              motion.p,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.3, duration: 0.6 },
                className: "text-xl md:text-2xl tracking-wider text-center",
                style: {
                  color: "#F3E7DF",
                  fontFamily: "Playfair Display, serif",
                  letterSpacing: "0.05em"
                },
                children: "Dare to Enter?"
              }
            ),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.5, duration: 0.6 },
                onClick: handleEnter,
                className: "group px-8 py-3 border border-[#F3E7DF]/60 hover:border-[#F3E7DF] transition-all duration-300 rounded-full mt-4",
                style: {
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#F3E7DF"
                },
                children: /* @__PURE__ */ jsxs("span", { className: "relative inline-block group-hover:font-medium", children: [
                  "Enter",
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "block h-[1px] bg-[#F3E7DF] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-0.5"
                    }
                  )
                ] })
              }
            )
          ]
        }
      )
    }
  ) });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "MKY \u2014 New Collection", "fullWidth": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "DareToEnter", DareToEnter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/DareToEnter.tsx", "client:component-export": "default" })}  ${maybeRenderHead()}<section class="max-w-none px-0 py-0"> ${renderComponent($$result2, "IntroVideo", IntroVideo, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/IntroVideo.tsx", "client:component-export": "default" })} </section>  <section class="py-16 px-4 md:px-10 lg:px-16"> <h2 class="text-2xl md:text-4xl tracking-tight mb-12 text-center" style="color: var(--brand-bg-exact); font-family: 'Playfair Display', serif;">
Explore a Selection of MKY's Creations
</h2> ${renderComponent($$result2, "Reveal", Reveal, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/Reveal.tsx", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"> <a href="/men/blazers" class="block text-center group relative overflow-hidden rounded-lg md:rounded-xl"> <div class="aspect-square overflow-hidden"> <img src="/images/explore-men-blazers.png" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Men's Blazers"> </div> <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6"> <div class="inline-block rounded-md bg-black/35 backdrop-blur-sm px-3 py-2 text-white"> <div class="text-lg md:text-xl tracking-wider" style="font-family: 'Playfair Display', serif;">Men's Blazers</div> </div> </div> </a> <a href="/women/blazers" class="block text-center group relative overflow-hidden rounded-lg md:rounded-xl" data-coming-soon> <div class="aspect-square overflow-hidden"> <img src="/images/explore-women-blazers.png" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Women's Blazers"> </div> <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6"> <div class="inline-block rounded-md bg-black/35 backdrop-blur-sm px-3 py-2 text-white"> <div class="text-lg md:text-xl tracking-wider" style="font-family: 'Playfair Display', serif;">Women's Blazers</div> </div> </div> </a> <a href="/men/trousers" class="block text-center group relative overflow-hidden rounded-lg md:rounded-xl"> <div class="aspect-square overflow-hidden"> <img src="/images/explore-men-trousers.jpeg" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Men's Trousers"> </div> <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6"> <div class="inline-block rounded-md bg-black/35 backdrop-blur-sm px-3 py-2 text-white"> <div class="text-lg md:text-xl tracking-wider" style="font-family: 'Playfair Display', serif;">Men's Trousers</div> </div> </div> </a> <a href="/women/trousers" class="block text-center group relative overflow-hidden rounded-lg md:rounded-xl" data-coming-soon> <div class="aspect-square overflow-hidden"> <img src="/images/explore-women-trousers.png" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Women's Trousers"> </div> <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6"> <div class="inline-block rounded-md bg-black/35 backdrop-blur-sm px-3 py-2 text-white"> <div class="text-lg md:text-xl tracking-wider" style="font-family: 'Playfair Display', serif;">Women's Trousers</div> </div> </div> </a> </div> ` })} </section>  <section class="-mx-4 md:-mx-6 my-16"> <div class="relative w-screen overflow-hidden" style="margin-left: calc(-50vw + 50%); height: 80vh; min-height: 850px;"> <picture class="absolute inset-0 w-full h-full"> <!-- Mobile image (<= 767px) --> <source media="(max-width: 767px)" srcset="/images/crafted-mobile.png"> <!-- Default / Desktop image --> <img src="/images/crafted.png" class="w-full h-full object-cover object-top" alt="Craftsmanship"> </picture> <div class="absolute inset-0 bg-black/30"></div> <div class="relative h-full flex items-center justify-center text-center px-6"> <div> <h2 class="text-white text-4xl md:text-6xl tracking-tight mb-4" style="font-family: 'Playfair Display', serif;">
MKY - The Lifestyle
</h2> <p class="text-white/90 text-lg md:text-xl max-w-2xl mx-auto tracking-wide" style="font-family: 'Inter', sans-serif; font-weight: 300;">
Every piece reflects our commitment to timeless elegance and exceptional quality
</p> </div> </div> </div> </section>   <section class="py-16 px-4 md:px-10 lg:px-16"> <h2 class="text-2xl md:text-4xl tracking-tight mb-12 text-center" style="color: var(--brand-bg-exact); font-family: 'Playfair Display', serif;">
Tailored Excellence
</h2> ${renderComponent($$result2, "Reveal", Reveal, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/Reveal.tsx", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"> <a href="/men/blazers" class="block text-center group relative overflow-hidden rounded-lg md:rounded-xl"> <div class="aspect-square overflow-hidden"> <img src="/images/tailored-excellence-1.jpeg" class="w-full h-full object-cover object-center transform scale-[1.04] transition-transform duration-700 md:group-hover:scale-110" alt="Men's Blazers"> </div> </a> <a href="/men/trousers" class="block text-center group relative overflow-hidden rounded-lg md:rounded-xl"> <div class="aspect-square overflow-hidden"> <img src="/images/tailored-excellence-2.jpeg" class="w-full h-full object-cover object-center transform scale-[1.04] transition-transform duration-700 md:group-hover:scale-110" alt="Men's Trousers"> </div> </a> <a href="/women/blazers" class="block text-center group relative overflow-hidden rounded-lg md:rounded-xl"> <div class="aspect-square overflow-hidden"> <img src="/images/tailored-excellence-3.jpeg" class="w-full h-full object-cover object-center transform scale-[1.04] transition-transform duration-700 md:group-hover:scale-110" alt="Women's Blazers"> </div> </a> <a href="/women/trousers" class="block text-center group relative overflow-hidden rounded-lg md:rounded-xl"> <div class="aspect-square overflow-hidden"> <img src="/images/tailored-excellence-4.jpeg" class="w-full h-full object-cover object-center transform scale-[1.04] transition-transform duration-700 md:group-hover:scale-110" alt="Women's Trousers"> </div> </a> </div> ` })} </section>  <section class="max-w-none px-0 py-0" style="width: 100vw; margin-left: calc(-50vw + 50%);"> <div class="flex items-center justify-center"${addAttribute({
    height: "120px",
    backgroundColor: "var(--brand-bg-exact)"
  }, "style")}> <img src="/logo.png" alt="MKY" class="w-16 h-16 object-contain"> </div> </section>  <section class="max-w-none px-0 py-0 mt-0 mb-20"> <div class="-mx-4 md:-mx-6"> ${renderComponent($$result2, "Reveal", Reveal, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/Reveal.tsx", "client:component-export": "default" }, { "default": ($$result3) => renderTemplate` <div class="grid md:grid-cols-2 gap-0" style="margin-left: calc(-50vw + 50%); width: 100vw;"> <a href="/men" class="block group relative overflow-hidden" style="height: 75vh; min-height: 600px;"> <img src="/images/men-category.jpg" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Men's Collection"> <div class="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div> <div class="relative h-full flex items-end p-8 md:p-12"> <h3 class="text-white text-3xl md:text-5xl tracking-wide" style="font-family: 'Playfair Display', serif;">Men's Collection</h3> </div> </a> <a href="/women" class="block group relative overflow-hidden" style="height: 75vh; min-height: 600px;"> <img src="/images/women-category.jpg" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Women's Collection"> <div class="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div> <div class="relative h-full flex items-end p-8 md:p-12"> <h3 class="text-white text-3xl md:text-5xl tracking-wide" style="font-family: 'Playfair Display', serif;">Women's Collection</h3> </div> </a> </div> ` })} </div> </section>  ${renderComponent($$result2, "ServicesBar", ServicesBar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/ServicesBar.tsx", "client:component-export": "default" })} <div id="coming-soon-modal" class="fixed inset-0 z-[120] hidden" aria-hidden="true"> <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" data-close-modal></div> <div class="relative z-[130] flex min-h-full items-center justify-center p-4"> <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"> <div class="flex items-start justify-between gap-4"> <div> <p class="text-sm uppercase tracking-[0.4em] text-neutral-500" style="font-family: 'Inter', sans-serif;">MKY Update</p> <h3 class="mt-3 text-3xl tracking-tight text-neutral-900" style="font-family: 'Playfair Display', serif;">Coming Soon</h3> <p class="mt-2 text-sm text-neutral-600" style="font-family: 'Inter', sans-serif; font-weight: 300;">
We're perfecting this collection. Leave your email and we'll let you know the moment it arrives.
</p> </div> <button type="button" class="shrink-0 rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700" aria-label="Close coming soon modal" data-close-modal> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-5 w-5"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18"></path> </svg> </button> </div> <form id="coming-soon-form" class="mt-8 space-y-4" novalidate> <label class="block text-sm font-medium text-neutral-700" style="font-family: 'Inter', sans-serif;">
Email address
<input id="coming-soon-email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" required class="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-neutral-900 outline-none transition focus:border-neutral-800 focus:bg-white" style="font-family: 'Inter', sans-serif;"> </label> <button type="submit" class="w-full rounded-2xl bg-neutral-900 px-5 py-3 text-sm uppercase tracking-[0.35em] text-white transition hover:bg-neutral-700" style="font-family: 'Inter', sans-serif;">
Notify Me
</button> <p data-feedback class="hidden text-sm text-emerald-600" style="font-family: 'Inter', sans-serif;">
Thank you! We'll keep you updated as soon as the collection launches.
</p> </form> <p class="mt-6 text-xs text-neutral-400" style="font-family: 'Inter', sans-serif;">
This signup is a preview experience. No data is stored.
</p> </div> </div> </div> ${renderScript($$result2, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/index.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
