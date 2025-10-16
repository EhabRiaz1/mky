export type Currency = 'GBP' | 'EUR';

const COOKIE = 'mky_currency';

export function getDefaultCurrency(): Currency {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language || '';
    if (lang.startsWith('en-GB')) return 'GBP';
    if (lang.startsWith('fr') || lang.startsWith('de') || lang.startsWith('it') || lang.startsWith('es')) return 'EUR';
  }
  return 'GBP';
}

export function readCurrency(): Currency {
  try {
    const m = document.cookie.match(new RegExp(`${COOKIE}=([^;]+)`));
    if (m) {
      const c = decodeURIComponent(m[1]) as Currency;
      if (c === 'GBP' || c === 'EUR') return c;
    }
  } catch {}
  return getDefaultCurrency();
}

export function writeCurrency(c: Currency) {
  try {
    document.cookie = `${COOKIE}=${encodeURIComponent(c)}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    localStorage.setItem(COOKIE, c);
  } catch {}
}

export function formatPrice(cents: number, currency: Currency): string {
  const amount = cents / 100;
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
}



