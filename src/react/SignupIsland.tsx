import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL as string, import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string)

export default function SignupIsland() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'GB',
    marketing_opt_in: false,
    showPassword: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const validateStep = (currentStep: number) => {
    const newErrors: {[key: string]: string} = {}
    
    if (currentStep === 1) {
      if (!form.first_name.trim()) newErrors.first_name = 'First name is required'
      if (!form.last_name.trim()) newErrors.last_name = 'Last name is required'
      if (!form.email.trim()) newErrors.email = 'Email is required'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g.test(form.email)) newErrors.email = 'Please enter a valid email'
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    }
    
    if (currentStep === 2) {
      if (!form.line1.trim()) newErrors.line1 = 'Address line 1 is required'
      if (!form.city.trim()) newErrors.city = 'City is required'
      if (!form.postcode.trim()) newErrors.postcode = 'Postcode is required'
    }
    
    if (currentStep === 3) {
      if (!form.password.trim()) newErrors.password = 'Password is required'
      if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
      if (!form.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password'
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setFieldErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateStep(step)) {
      return
    }
    
    setLoading(true)
    setError(null)

    const { data: auth, error: authErr } = await supabase.auth.signUp({ 
      email: form.email, 
      password: form.password, 
      phone: form.phone || undefined 
    })
    
    if (authErr || !auth.user) { 
      setError(authErr?.message || 'Sign up failed')
      setLoading(false)
      return 
    }
    
    const userId = auth.user.id

    // Create default address
    let addressId: string | null = null
    if (form.line1 && form.city && form.postcode && form.country) {
      const { data: addr, error: addrErr } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          type: 'shipping',
          first_name: form.first_name,
          last_name: form.last_name,
          line1: form.line1,
          line2: form.line2 || null,
          city: form.city,
          state: form.state || null,
          postal_code: form.postcode,
          country: form.country,
          phone: form.phone || null,
        })
        .select('id')
        .single()
      if (!addrErr && addr) addressId = (addr as any).id
    }

    // Update profile
    await supabase
      .from('profiles')
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        display_name: `${form.first_name} ${form.last_name}`.trim(),
        marketing_opt_in: form.marketing_opt_in,
        default_shipping_address_id: addressId,
        default_billing_address_id: addressId,
        default_currency: 'GBP',
        terms_accepted_at: new Date().toISOString(),
      })
      .eq('id', userId)

    // Redirect
    location.href = '/'
  }

  const InputField = ({ 
    name, 
    type = 'text', 
    placeholder, 
    required = false,
    className = ''
  }: { 
    name: keyof typeof form, 
    type?: string, 
    placeholder: string,
    required?: boolean,
    className?: string
  }) => (
    <div className="relative">
      <input
        type={name === 'password' || name === 'confirmPassword' ? (form.showPassword ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={form[name] as string}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        required={required}
        className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black/10 ${fieldErrors[name] ? 'border-red-500' : 'border-gray-200'} ${className}`}
      />
      {fieldErrors[name] && (
        <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="flex justify-center items-center min-h-[500px]">
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-6">Create Your Account</h2>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="card bg-white rounded-lg p-6 mb-4 border border-gray-100">
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField name="first_name" placeholder="First name" required />
                    <InputField name="last_name" placeholder="Last name" required />
                  </div>
                  <InputField name="email" type="email" placeholder="Email address" required />
                  <InputField name="phone" placeholder="Phone number" required />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card bg-white rounded-lg p-6 mb-4 border border-gray-100">
                <h3 className="text-lg font-medium mb-4">Address Information</h3>
                <div className="space-y-4">
                  <InputField name="line1" placeholder="Address line 1" required />
                  <InputField name="line2" placeholder="Address line 2 (optional)" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField name="city" placeholder="City" required />
                    <InputField name="state" placeholder="State/County" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField name="postcode" placeholder="Postcode" required />
                    <select 
                      value={form.country} 
                      onChange={(e)=>setForm({ ...form, country: e.target.value })} 
                      className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black/10"
                    >
                      <option value="GB">United Kingdom</option>
                      <option value="IE">Ireland</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="ES">Spain</option>
                      <option value="IT">Italy</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card bg-white rounded-lg p-6 mb-4 border border-gray-100">
                <h3 className="text-lg font-medium mb-4">Create Password</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <InputField name="password" placeholder="Password" required />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setForm({ ...form, showPassword: !form.showPassword })}
                    >
                      {form.showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <InputField name="confirmPassword" placeholder="Confirm password" required />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={form.marketing_opt_in}
                      onChange={(e) => setForm({ ...form, marketing_opt_in: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="marketing" className="text-sm">
                      Receive updates and offers
                    </label>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={handlePrev}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary rounded-lg"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-primary rounded-lg" 
                  disabled={loading}
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Fixed Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2">
        <div className="max-w-lg mx-auto px-4">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Personal</span>
            <span>Address</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </div>
  )
}