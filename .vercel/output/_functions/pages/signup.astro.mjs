/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Crtkq0Sq.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

const supabase = createClient("https://apkohkqyebipmzvdwxgr.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwa29oa3F5ZWJpcG16dmR3eGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODQwNDgsImV4cCI6MjA3NDU2MDA0OH0.eEvBZRf_sFDKThtjg9PxqDiK-N4eGkhxpf3W8DNqHQs");
function SignupIsland() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postcode: "",
    country: "GB",
    marketing_opt_in: false,
    showPassword: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!form.first_name.trim()) newErrors.first_name = "First name is required";
      if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g.test(form.email)) newErrors.email = "Please enter a valid email";
      if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    }
    if (currentStep === 2) {
      if (!form.line1.trim()) newErrors.line1 = "Address line 1 is required";
      if (!form.city.trim()) newErrors.city = "City is required";
      if (!form.postcode.trim()) newErrors.postcode = "Postcode is required";
    }
    if (currentStep === 3) {
      if (!form.password.trim()) newErrors.password = "Password is required";
      if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (!form.confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  const handlePrev = () => {
    setStep(step - 1);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(step)) {
      return;
    }
    setLoading(true);
    setError(null);
    const { data: auth, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      phone: form.phone || void 0
    });
    if (authErr || !auth.user) {
      setError(authErr?.message || "Sign up failed");
      setLoading(false);
      return;
    }
    const userId = auth.user.id;
    let addressId = null;
    if (form.line1 && form.city && form.postcode && form.country) {
      const { data: addr, error: addrErr } = await supabase.from("addresses").insert({
        user_id: userId,
        type: "shipping",
        first_name: form.first_name,
        last_name: form.last_name,
        line1: form.line1,
        line2: form.line2 || null,
        city: form.city,
        state: form.state || null,
        postal_code: form.postcode,
        country: form.country,
        phone: form.phone || null
      }).select("id").single();
      if (!addrErr && addr) addressId = addr.id;
    }
    await supabase.from("profiles").update({
      first_name: form.first_name,
      last_name: form.last_name,
      display_name: `${form.first_name} ${form.last_name}`.trim(),
      marketing_opt_in: form.marketing_opt_in,
      default_shipping_address_id: addressId,
      default_billing_address_id: addressId,
      default_currency: "GBP",
      terms_accepted_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", userId);
    location.href = "/";
  }
  const InputField = ({
    name,
    type = "text",
    placeholder,
    required = false,
    className = ""
  }) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: name === "password" || name === "confirmPassword" ? form.showPassword ? "text" : "password" : type,
        placeholder,
        value: form[name],
        onChange: (e) => setForm({ ...form, [name]: e.target.value }),
        required,
        className: `border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black/10 ${fieldErrors[name] ? "border-red-500" : "border-gray-200"} ${className}`
      }
    ),
    fieldErrors[name] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: fieldErrors[name] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center min-h-[500px]", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-medium text-center mb-6", children: "Create Your Account" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
        step === 1 && /* @__PURE__ */ jsxs("div", { className: "card bg-white rounded-lg p-6 mb-4 border border-gray-100", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: "Personal Information" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(InputField, { name: "first_name", placeholder: "First name", required: true }),
              /* @__PURE__ */ jsx(InputField, { name: "last_name", placeholder: "Last name", required: true })
            ] }),
            /* @__PURE__ */ jsx(InputField, { name: "email", type: "email", placeholder: "Email address", required: true }),
            /* @__PURE__ */ jsx(InputField, { name: "phone", placeholder: "Phone number", required: true })
          ] })
        ] }),
        step === 2 && /* @__PURE__ */ jsxs("div", { className: "card bg-white rounded-lg p-6 mb-4 border border-gray-100", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: "Address Information" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(InputField, { name: "line1", placeholder: "Address line 1", required: true }),
            /* @__PURE__ */ jsx(InputField, { name: "line2", placeholder: "Address line 2 (optional)" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(InputField, { name: "city", placeholder: "City", required: true }),
              /* @__PURE__ */ jsx(InputField, { name: "state", placeholder: "State/County" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(InputField, { name: "postcode", placeholder: "Postcode", required: true }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: form.country,
                  onChange: (e) => setForm({ ...form, country: e.target.value }),
                  className: "border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black/10",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "GB", children: "United Kingdom" }),
                    /* @__PURE__ */ jsx("option", { value: "IE", children: "Ireland" }),
                    /* @__PURE__ */ jsx("option", { value: "FR", children: "France" }),
                    /* @__PURE__ */ jsx("option", { value: "DE", children: "Germany" }),
                    /* @__PURE__ */ jsx("option", { value: "ES", children: "Spain" }),
                    /* @__PURE__ */ jsx("option", { value: "IT", children: "Italy" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        step === 3 && /* @__PURE__ */ jsxs("div", { className: "card bg-white rounded-lg p-6 mb-4 border border-gray-100", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: "Create Password" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(InputField, { name: "password", placeholder: "Password", required: true }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",
                  onClick: () => setForm({ ...form, showPassword: !form.showPassword }),
                  children: form.showPassword ? "Hide" : "Show"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(InputField, { name: "confirmPassword", placeholder: "Confirm password", required: true }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: "marketing",
                  checked: form.marketing_opt_in,
                  onChange: (e) => setForm({ ...form, marketing_opt_in: e.target.checked }),
                  className: "mr-2"
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "marketing", className: "text-sm", children: "Receive updates and offers" })
            ] })
          ] })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "text-red-600 text-sm mb-4", children: error }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between mt-6", children: [
          step > 1 && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handlePrev,
              className: "px-6 py-2 border border-gray-300 rounded-lg text-gray-700",
              children: "Back"
            }
          ),
          step < 3 ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleNext,
              className: "btn btn-primary rounded-lg",
              children: "Next"
            }
          ) : /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "btn btn-primary rounded-lg",
              disabled: loading,
              children: loading ? "Creating account…" : "Create account"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2", children: /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto px-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 h-2 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-black transition-all duration-300 ease-in-out",
          style: { width: `${step / 3 * 100}%` }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between mt-1 text-xs text-gray-500", children: [
        /* @__PURE__ */ jsx("span", { children: "Personal" }),
        /* @__PURE__ */ jsx("span", { children: "Address" }),
        /* @__PURE__ */ jsx("span", { children: "Security" })
      ] })
    ] }) })
  ] });
}

const $$Signup = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Sign up", "stickyHeader": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-[800px] mx-auto px-4 md:px-6 py-6 md:py-8"> ${renderComponent($$result2, "SignupIsland", SignupIsland, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/react/SignupIsland", "client:component-export": "default" })} </div> ` })} `;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/signup.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/signup.astro";
const $$url = "/signup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Signup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
