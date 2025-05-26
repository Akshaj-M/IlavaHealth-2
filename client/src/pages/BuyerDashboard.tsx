import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FaShoppingBasket, 
  FaSearch, 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaBars, 
  FaHome,
  FaLeaf,
  FaRecycle,
  FaSeedling,
  FaAppleAlt,
  FaTractor,
  FaFilter
} from 'react-icons/fa';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AIAssistant from '@/components/AIAssistant';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  seller: string;
  rating: number;
  location: string;
}

export default function BuyerDashboard() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t } = useLanguage();

  const categories = [
    { id: 'all', name: t('all_products'), icon: FaShoppingBasket },
    { id: 'compost', name: t('compost'), icon: FaSeedling },
    { id: 'plant-waste', name: t('plant_waste'), icon: FaLeaf },
    { id: 'crop-residues', name: t('crop_residues'), icon: FaTractor },
    { id: 'fruit-waste', name: t('fruit_waste'), icon: FaAppleAlt },
    { id: 'organic-waste', name: t('organic_waste'), icon: FaSeedling },
    { id: 'bio-fertilizers', name: t('bio_fertilizers'), icon: FaLeaf },
    { id: 'recycled', name: t('recycled_products'), icon: FaRecycle },
  ];

  const featuredProducts: Product[] = [
    // Compost Products
    {
      id: 1,
      name: 'Premium Rice Husk Compost',
      price: '₹25/kg',
      category: 'compost',
      image: '/api/placeholder/200/200',
      seller: 'Ram Kumar Farm',
      rating: 4.8,
      location: 'Punjab'
    },
    {
      id: 2,
      name: 'Vermicompost Premium',
      price: '₹35/kg',
      category: 'compost',
      image: '/api/placeholder/200/200',
      seller: 'Green Earth Farms',
      rating: 4.9,
      location: 'Karnataka'
    },
    {
      id: 3,
      name: 'Cow Dung Compost',
      price: '₹20/kg',
      category: 'compost',
      image: '/api/placeholder/200/200',
      seller: 'Dairy Fresh Farm',
      rating: 4.7,
      location: 'Gujarat'
    },
    // Crop Residues
    {
      id: 4,
      name: 'Organic Wheat Straw',
      price: '₹15/kg',
      category: 'crop-residues',
      image: '/api/placeholder/200/200',
      seller: 'Green Valley Farms',
      rating: 4.6,
      location: 'Haryana'
    },
    {
      id: 5,
      name: 'Rice Husk Raw',
      price: '₹12/kg',
      category: 'crop-residues',
      image: '/api/placeholder/200/200',
      seller: 'Paddy Fields Co.',
      rating: 4.4,
      location: 'Andhra Pradesh'
    },
    {
      id: 6,
      name: 'Sugarcane Bagasse',
      price: '₹18/kg',
      category: 'crop-residues',
      image: '/api/placeholder/200/200',
      seller: 'Sweet Cane Farms',
      rating: 4.5,
      location: 'Maharashtra'
    },
    // Bio Fertilizers
    {
      id: 7,
      name: 'Bio Fertilizer Mix',
      price: '₹45/kg',
      category: 'bio-fertilizers',
      image: '/api/placeholder/200/200',
      seller: 'Eco Farm Solutions',
      rating: 4.9,
      location: 'Uttar Pradesh'
    },
    {
      id: 8,
      name: 'Organic NPK Blend',
      price: '₹55/kg',
      category: 'bio-fertilizers',
      image: '/api/placeholder/200/200',
      seller: 'Nature Grow Co.',
      rating: 4.8,
      location: 'Tamil Nadu'
    },
    {
      id: 9,
      name: 'Phosphorous Rich Fertilizer',
      price: '₹40/kg',
      category: 'bio-fertilizers',
      image: '/api/placeholder/200/200',
      seller: 'Soil Science Labs',
      rating: 4.6,
      location: 'West Bengal'
    },
    // Plant Waste
    {
      id: 10,
      name: 'Banana Leaf Waste',
      price: '₹8/kg',
      category: 'plant-waste',
      image: '/api/placeholder/200/200',
      seller: 'South India Farms',
      rating: 4.5,
      location: 'Tamil Nadu'
    },
    {
      id: 11,
      name: 'Coconut Coir',
      price: '₹22/kg',
      category: 'plant-waste',
      image: '/api/placeholder/200/200',
      seller: 'Coastal Agri Works',
      rating: 4.7,
      location: 'Kerala'
    },
    {
      id: 12,
      name: 'Dried Leaves Mix',
      price: '₹10/kg',
      category: 'plant-waste',
      image: '/api/placeholder/200/200',
      seller: 'Garden Fresh Co.',
      rating: 4.3,
      location: 'Himachal Pradesh'
    },
    // Fruit Waste
    {
      id: 13,
      name: 'Orange Peel Compost',
      price: '₹30/kg',
      category: 'fruit-waste',
      image: '/api/placeholder/200/200',
      seller: 'Citrus Valley Farm',
      rating: 4.6,
      location: 'Nagpur'
    },
    {
      id: 14,
      name: 'Apple Pomace',
      price: '₹28/kg',
      category: 'fruit-waste',
      image: '/api/placeholder/200/200',
      seller: 'Hill Station Orchards',
      rating: 4.7,
      location: 'Himachal Pradesh'
    },
    // Recycled Products
    {
      id: 15,
      name: 'Recycled Plastic Planters',
      price: '₹120/piece',
      category: 'recycled',
      image: '/api/placeholder/200/200',
      seller: 'Green Recyclers',
      rating: 4.5,
      location: 'Maharashtra'
    },
    {
      id: 16,
      name: 'Eco-Friendly Pots',
      price: '₹85/piece',
      category: 'recycled',
      image: '/api/placeholder/200/200',
      seller: 'Sustainable Solutions',
      rating: 4.4,
      location: 'Karnataka'
    },
    // Organic Waste
    {
      id: 17,
      name: 'Mixed Organic Waste',
      price: '₹16/kg',
      category: 'organic-waste',
      image: '/api/placeholder/200/200',
      seller: 'Organic Circle Farm',
      rating: 4.2,
      location: 'Odisha'
    },
    {
      id: 18,
      name: 'Kitchen Waste Compost',
      price: '₹24/kg',
      category: 'organic-waste',
      image: '/api/placeholder/200/200',
      seller: 'Zero Waste Farm',
      rating: 4.8,
      location: 'Rajasthan'
    }
  ];

  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FaBars className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
                      <FaShoppingBasket className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold text-blue-700">{t('buyer_menu')}</span>
                    </div>
                    
                    <nav className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/buyer')}
                      >
                        <FaHome className="mr-2 h-4 w-4" />
                        {t('home')}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/categories')}
                      >
                        <FaLeaf className="mr-2 h-4 w-4" />
                        {t('categories')}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/my-orders')}
                      >
                        <FaShoppingCart className="mr-2 h-4 w-4" />
                        {t('my_orders')}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/favorites')}
                      >
                        <FaHeart className="mr-2 h-4 w-4" />
                        {t('favorites')}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/profile')}
                      >
                        <FaUser className="mr-2 h-4 w-4" />
                        {t('my_profile')}
                      </Button>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-bold text-gray-900">{t('buyer_dashboard')}</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <div className="flex items-center space-x-2">
              <FaShoppingBasket className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-blue-700">ILAVA</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('search_organic_products')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">{t('categories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4 text-center">
                <category.icon className={`h-8 w-8 mx-auto mb-2 ${
                  selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <p className={`text-sm font-medium ${
                  selectedCategory === category.id ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {category.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {selectedCategory === 'all' ? t('featured_products') : 
             categories.find(c => c.id === selectedCategory)?.name || t('products')}
          </h2>
          <Button variant="outline" size="sm">
            <FaFilter className="mr-2 h-4 w-4" />
            {t('filter')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to favorites logic
                  }}
                >
                  <FaHeart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.seller}</p>
                <p className="text-sm text-gray-500 mb-2">{product.location}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">{product.price}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      // Add to cart logic
                    }}
                  >
                    <FaShoppingCart className="mr-2 h-4 w-4" />
                    {t('add_to_cart')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setLocation(`/product/${product.id}`)}
                  >
                    {t('view')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <FaLeaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('no_products_found')}</h3>
            <p className="text-gray-500">{t('adjust_search_filter')}</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto text-blue-600"
            onClick={() => setLocation('/buyer')}
          >
            <FaHome className="h-5 w-5 mb-1" />
            <span className="text-xs">{t('home')}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => setLocation('/categories')}
          >
            <FaLeaf className="h-5 w-5 mb-1" />
            <span className="text-xs">{t('categories')}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => setLocation('/search')}
          >
            <FaSearch className="h-5 w-5 mb-1" />
            <span className="text-xs">{t('search')}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => setLocation('/cart')}
          >
            <FaShoppingCart className="h-5 w-5 mb-1" />
            <span className="text-xs">{t('cart')}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => setLocation('/profile')}
          >
            <FaUser className="h-5 w-5 mb-1" />
            <span className="text-xs">{t('profile')}</span>
          </Button>
        </div>
      </nav>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}