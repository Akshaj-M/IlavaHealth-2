import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FaLeaf, 
  FaCamera, 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaBars, 
  FaHome,
  FaPlus,
  FaEye,
  FaRupeeSign,
  FaWeight
} from 'react-icons/fa';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AIAssistant from '@/components/AIAssistant';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function FarmerDashboard() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const quickStats = [
    { title: t('active_listings'), value: '12', icon: FaLeaf, color: 'text-green-600' },
    { title: t('total_sales'), value: '₹45,680', icon: FaRupeeSign, color: 'text-blue-600' },
    { title: t('pending_orders'), value: '8', icon: FaShoppingCart, color: 'text-orange-600' },
    { title: t('profile_views'), value: '156', icon: FaEye, color: 'text-purple-600' },
  ];

  const recentListings = [
    { name: 'Rice Husk', quantity: '50 kg', price: '₹15/kg', status: t('active') },
    { name: 'Wheat Straw', quantity: '100 kg', price: '₹8/kg', status: t('sold') },
    { name: 'Corn Stalks', quantity: '75 kg', price: '₹12/kg', status: t('active') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                      <FaLeaf className="h-6 w-6 text-green-600" />
                      <span className="font-semibold text-green-700">{t('farmer_menu')}</span>
                    </div>

                    <nav className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/farmer')}
                      >
                        <FaHome className="mr-2 h-4 w-4" />
                        {t('dashboard')}
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/sell-waste')}
                      >
                        <FaCamera className="mr-2 h-4 w-4" />
                        {t('sell_your_waste')}
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

            <h1 className="text-xl font-bold text-gray-900">{t('farmer_dashboard')}</h1>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <div className="flex items-center space-x-2">
              <FaLeaf className="h-8 w-8 text-green-600" />
              <span className="font-bold text-green-700">ILAVA</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">{t('welcome_farmer')}</h2>
            <p className="text-green-100 mb-4">
              {t('welcome_subtitle')}
            </p>
            <Button 
              variant="secondary" 
              onClick={() => setLocation('/sell-waste')}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              {t('list_new_waste')}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-animation">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover-lift transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold animate-fadeIn">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} animate-float`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recent_listings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentListings.map((listing, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FaWeight className="h-6 w-6 text-gray-400" />
                    <div>
                      <h3 className="font-semibold">{listing.name}</h3>
                      <p className="text-sm text-gray-600">{listing.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{listing.price}</p>
                    <Badge variant={listing.status === t('active') ? 'default' : 'secondary'}>
                      {listing.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              {t('view_all_listings')}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => setLocation('/sell-waste')}>
            <CardContent className="p-6 text-center">
              <FaCamera className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('scan_sell_waste')}</h3>
              <p className="text-sm text-gray-600">{t('ai_identify_price')}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setLocation('/my-orders')}>
            <CardContent className="p-6 text-center">
              <FaShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('manage_orders')}</h3>
              <p className="text-sm text-gray-600">{t('track_fulfill_orders')}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto text-green-600"
            onClick={() => setLocation('/farmer')}
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
            onClick={() => setLocation('/sell-waste')}
          >
            <div className="bg-green-600 rounded-full p-2 mb-1">
              <FaCamera className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs">{t('scan')}</span>
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
      <AIAssistant />
    </div>
  );
}