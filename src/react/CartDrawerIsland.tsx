import { useEffect, useState } from 'react';
import CartDrawer from '../components/CartDrawer';

export default function CartDrawerIsland() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for cart button clicks
    const handleCartButtonClick = () => {
      setIsOpen(true);
    };

    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
      cartButton.addEventListener('click', handleCartButtonClick);
    }

    // Listen for cart changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mky_cart' && e.newValue) {
        // Cart was updated, open drawer
        const items = JSON.parse(e.newValue || '[]');
        if (items.length > 0) {
          setIsOpen(true);
        }
      }
    };

    // Also listen for changes within the same tab
    const originalSetItem = localStorage.setItem;
    let isSettingCart = false;
    localStorage.setItem = function(key: string, value: string) {
      const oldValue = localStorage.getItem(key);
      originalSetItem.apply(this, arguments);
      
      if (key === 'mky_cart' && oldValue !== value && !isSettingCart) {
        // Avoid infinite recursion
        isSettingCart = true;
        try {
          const items = JSON.parse(value || '[]');
          if (items.length > 0) {
            setIsOpen(true);
          }
        } finally {
          isSettingCart = false;
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (cartButton) {
        cartButton.removeEventListener('click', handleCartButtonClick);
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
