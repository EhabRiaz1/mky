import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';

function CatalogTopBar({ categoryTitle, onFilterClick }) {
  return /* @__PURE__ */ jsx("div", { className: "border-b border-neutral-200 sticky top-0 z-30", style: { backgroundColor: "var(--brand-ink-exact)" }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-light tracking-wide", children: categoryTitle }),
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "w-4 h-4 text-neutral-600",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M19 9l-7 7-7-7" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: onFilterClick,
        className: "flex items-center gap-2 px-4 py-2 border border-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white transition-colors text-sm font-light tracking-wide",
        children: [
          /* @__PURE__ */ jsx("span", { children: "Filters" }),
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" })
            }
          )
        ]
      }
    )
  ] }) });
}

function CategoryIconNav({ categories, currentCategory }) {
  return /* @__PURE__ */ jsx("div", { className: "border-b border-neutral-200", style: { backgroundColor: "var(--brand-ink-exact)" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-12 overflow-x-auto scrollbar-hide", children: categories.map((category) => /* @__PURE__ */ jsxs(
    "a",
    {
      href: category.href,
      className: `flex flex-col items-center gap-3 min-w-[100px] group transition-opacity ${currentCategory === category.name ? "opacity-100" : "opacity-60 hover:opacity-100"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: category.icon,
            alt: category.name,
            className: "w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
          }
        ) }),
        /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm font-light tracking-wide text-center", children: category.name })
      ]
    },
    category.name
  )) }) }) });
}

function CatalogHero({ image, alt, mobileImage }) {
  return /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("div", { className: "relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden", children: /* @__PURE__ */ jsxs("picture", { children: [
    mobileImage && /* @__PURE__ */ jsx("source", { media: "(max-width: 768px)", srcSet: mobileImage }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: image,
        alt,
        className: "w-full h-full object-cover object-top",
        loading: "eager"
      }
    )
  ] }) }) });
}

export { CatalogTopBar as C, CategoryIconNav as a, CatalogHero as b };
