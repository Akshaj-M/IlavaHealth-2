
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  isKannada: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  // Dashboard Headers
  'farmer_dashboard': { en: 'Farmer Dashboard', kn: 'ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  'buyer_dashboard': { en: 'ILAVA Marketplace', kn: 'ಇಲಾವಾ ಮಾರುಕಟ್ಟೆ' },
  
  // Navigation
  'home': { en: 'Home', kn: 'ಮನೆ' },
  'categories': { en: 'Categories', kn: 'ವರ್ಗಗಳು' },
  'my_orders': { en: 'My Orders', kn: 'ನನ್ನ ಆದೇಶಗಳು' },
  'favorites': { en: 'Favorites', kn: 'ಮೆಚ್ಚಿನವುಗಳು' },
  'my_profile': { en: 'My Profile', kn: 'ನನ್ನ ಪ್ರೊಫೈಲ್' },
  'dashboard': { en: 'Dashboard', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  'cart': { en: 'Cart', kn: 'ಕಾರ್ಟ್' },
  'search': { en: 'Search', kn: 'ಹುಡುಕು' },
  'scan': { en: 'Scan', kn: 'ಸ್ಕ್ಯಾನ್' },
  'profile': { en: 'Profile', kn: 'ಪ್ರೊಫೈಲ್' },
  
  // Welcome Messages
  'welcome_farmer': { en: 'Welcome back, Farmer!', kn: 'ರೈತರೇ, ಮತ್ತೆ ಸ್ವಾಗತ!' },
  'welcome_subtitle': { en: 'Turn your agricultural waste into valuable income with ILAVA', kn: 'ಇಲಾವಾದೊಂದಿಗೆ ನಿಮ್ಮ ಕೃಷಿ ತ್ಯಾಜ್ಯವನ್ನು ಬೆಲೆಯುಳ್ಳ ಆದಾಯವಾಗಿ ಪರಿವರ್ತಿಸಿ' },
  
  // Stats
  'active_listings': { en: 'Active Listings', kn: 'ಸಕ್ರಿಯ ಪಟ್ಟಿಗಳು' },
  'total_sales': { en: 'Total Sales', kn: 'ಒಟ್ಟು ಮಾರಾಟ' },
  'pending_orders': { en: 'Pending Orders', kn: 'ಬಾಕಿ ಆದೇಶಗಳು' },
  'profile_views': { en: 'Profile Views', kn: 'ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಣೆಗಳು' },
  
  // Actions
  'list_new_waste': { en: 'List New Waste', kn: 'ಹೊಸ ತ್ಯಾಜ್ಯ ಪಟ್ಟಿ ಮಾಡಿ' },
  'sell_your_waste': { en: 'Sell Your Waste', kn: 'ನಿಮ್ಮ ತ್ಯಾಜ್ಯವನ್ನು ಮಾರಿ' },
  'scan_sell_waste': { en: 'Scan & Sell Waste', kn: 'ತ್ಯಾಜ್ಯವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಮತ್ತು ಮಾರಿ' },
  'manage_orders': { en: 'Manage Orders', kn: 'ಆದೇಶಗಳನ್ನು ನಿರ್ವಹಿಸಿ' },
  'add_to_cart': { en: 'Add to Cart', kn: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ' },
  'view': { en: 'View', kn: 'ವೀಕ್ಷಿಸಿ' },
  'view_all_listings': { en: 'View All Listings', kn: 'ಎಲ್ಲಾ ಪಟ್ಟಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ' },
  'filter': { en: 'Filter', kn: 'ಫಿಲ್ಟರ್' },
  
  // Sections
  'recent_listings': { en: 'Recent Listings', kn: 'ಇತ್ತೀಚಿನ ಪಟ್ಟಿಗಳು' },
  'featured_products': { en: 'Featured Products', kn: 'ವೈಶಿಷ್ಟ್ಯಗೊಳಿಸಿದ ಉತ್ಪನ್ನಗಳು' },
  'all_products': { en: 'All Products', kn: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು' },
  'products': { en: 'Products', kn: 'ಉತ್ಪನ್ನಗಳು' },
  
  // Categories
  'compost': { en: 'Compost', kn: 'ಕಂಪೋಸ್ಟ್' },
  'plant_waste': { en: 'Plant Waste', kn: 'ಸಸ್ಯ ತ್ಯಾಜ್ಯ' },
  'crop_residues': { en: 'Crop Residues', kn: 'ಬೆಳೆ ಅವಶೇಷಗಳು' },
  'fruit_waste': { en: 'Fruit Waste', kn: 'ಹಣ್ಣಿನ ತ್ಯಾಜ್ಯ' },
  'organic_waste': { en: 'Organic Waste', kn: 'ಸಾವಯವ ತ್ಯಾಜ್ಯ' },
  'bio_fertilizers': { en: 'Bio Fertilizers', kn: 'ಜೈವಿಕ ಗೊಬ್ಬರಗಳು' },
  'recycled_products': { en: 'Recycled Products', kn: 'ಮರುಬಳಕೆ ಉತ್ಪನ್ನಗಳು' },
  
  // Search
  'search_organic_products': { en: 'Search organic products...', kn: 'ಸಾವಯವ ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...' },
  
  // Descriptions
  'ai_identify_price': { en: 'Use AI to identify and price your waste', kn: 'ನಿಮ್ಮ ತ್ಯಾಜ್ಯವನ್ನು ಗುರುತಿಸಲು ಮತ್ತು ಬೆಲೆ ನಿಗದಿಗೊಳಿಸಲು AI ಬಳಸಿ' },
  'track_fulfill_orders': { en: 'Track and fulfill your orders', kn: 'ನಿಮ್ಮ ಆದೇಶಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಪೂರೈಸಿ' },
  
  // Status
  'active': { en: 'Active', kn: 'ಸಕ್ರಿಯ' },
  'sold': { en: 'Sold', kn: 'ಮಾರಾಟವಾಗಿದೆ' },
  
  // Empty States
  'no_products_found': { en: 'No products found', kn: 'ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ' },
  'adjust_search_filter': { en: 'Try adjusting your search or category filter', kn: 'ನಿಮ್ಮ ಹುಡುಕಾಟ ಅಥವಾ ವರ್ಗ ಫಿಲ್ಟರ್ ಅನ್ನು ಸರಿಹೊಂದಿಸಲು ಪ್ರಯತ್ನಿಸಿ' },
  
  // Menus
  'farmer_menu': { en: 'Farmer Menu', kn: 'ರೈತ ಮೆನು' },
  'buyer_menu': { en: 'Buyer Menu', kn: 'ಖರೀದಿದಾರ ಮೆನು' }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isKannada, setIsKannada] = useState(false);

  const toggleLanguage = () => {
    setIsKannada(!isKannada);
  };

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return isKannada ? translation.kn : translation.en;
  };

  return (
    <LanguageContext.Provider value={{ isKannada, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
