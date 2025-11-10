/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Crtkq0Sq.mjs';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const supabase = createClient("https://apkohkqyebipmzvdwxgr.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwa29oa3F5ZWJpcG16dmR3eGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODQwNDgsImV4cCI6MjA3NDU2MDA0OH0.eEvBZRf_sFDKThtjg9PxqDiK-N4eGkhxpf3W8DNqHQs");
function LoginIsland() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: error2 } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error2) {
      setError("Invalid credentials");
      return;
    }
    location.href = "/";
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "text-zinc-600 mb-6 text-center md:text-left", children: "Sign in to access your account, track orders, and enjoy a personalized shopping experience." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "grid gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "text-sm font-medium text-zinc-800", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "email",
            required: true,
            type: "email",
            placeholder: "your@email.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: "border border-zinc-300 p-3 w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all bg-[#FCFBF9] rounded-lg"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "text-sm font-medium text-zinc-800", children: "Password" }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-xs text-zinc-600 hover:text-[var(--accent)] transition-colors", children: "Forgot password?" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "password",
            required: true,
            type: "password",
            placeholder: "••••••••••",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "border border-zinc-300 p-3 w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all bg-[#FCFBF9] rounded-lg"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "text-red-600 text-sm bg-red-50 p-3 border border-red-100 rounded-lg", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "btn btn-primary mt-2 rounded-lg",
          disabled: loading,
          style: {
            background: "var(--brand-bg-exact)",
            letterSpacing: "0.075em",
            fontWeight: 500,
            padding: "1rem 0"
          },
          children: loading ? "Signing in…" : "Sign in"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-center md:text-left mt-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-600", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "text-[var(--accent)] font-medium hover:underline", children: "Create account" })
      ] }) })
    ] })
  ] });
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Sign in" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-[1000px] mx-auto px-4 md:px-6 py-12 md:py-16"> <div class="flex flex-col md:flex-row shadow-sm overflow-hidden rounded-xl"> <div class="hidden md:block md:w-[45%] bg-[var(--brand-bg-exact)] relative"> <img src="/images/tailored-excellence-1.jpeg" alt="Luxury Tailoring" class="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"> <div class="absolute inset-0 flex flex-col justify-center items-center text-[var(--brand-ink-exact)] p-8"> <h2 class="text-3xl font-serif mb-4 text-center">Elegance in Every Detail</h2> <p class="text-sm opacity-90 text-center max-w-xs">Sign in to continue your journey with the world's finest tailored clothing.</p> </div> </div> <div class="w-full md:w-[55%] bg-white p-8 md:p-12 rounded-xl md:rounded-l-none"> <h1 class="font-serif text-3xl md:text-3xl mb-6 text-center md:text-left">Welcome Back</h1> ${renderComponent($$result2, "LoginIsland", LoginIsland, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/react/LoginIsland", "client:component-export": "default" })} </div> </div> </div> ` })} `;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/login.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
