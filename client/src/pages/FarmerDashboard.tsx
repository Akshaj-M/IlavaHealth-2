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

export default function FarmerDashboard() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const quickStats = [
    { title: 'Active Listings', value: '12', icon: FaLeaf, color: 'text-green-600' },
    { title: 'Total Sales', value: '₹45,680', icon: FaRupeeSign, color: 'text-blue-600' },
    { title: 'Pending Orders', value: '8', icon: FaShoppingCart, color: 'text-orange-600' },
    { title: 'Profile Views', value: '156', icon: FaEye, color: 'text-purple-600' },
  ];

  const recentListings = [
    { name: 'Rice Husk', quantity: '50 kg', price: '₹15/kg', status: 'Active' },
    { name: 'Wheat Straw', quantity: '100 kg', price: '₹8/kg', status: 'Sold' },
    { name: 'Corn Stalks', quantity: '75 kg', price: '₹12/kg', status: 'Active' },
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
                      <span className="font-semibold text-green-700">Farmer Menu</span>
                    </div>

                    <nav className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/farmer')}
                      >
                        <FaHome className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/sell-waste')}
                      >
                        <FaCamera className="mr-2 h-4 w-4" />
                        Sell Your Waste
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/my-orders')}
                      >
                        <FaShoppingCart className="mr-2 h-4 w-4" />
                        My Orders
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/favorites')}
                      >
                        <FaHeart className="mr-2 h-4 w-4" />
                        Favorites
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => setLocation('/profile')}
                      >
                        <FaUser className="mr-2 h-4 w-4" />
                        My Profile
                      </Button>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-xl font-bold text-gray-900">Farmer Dashboard</h1>
          </div>

          <div className="flex items-center space-x-2">
            <FaLeaf className="h-8 w-8 text-green-600" />
            <span className="font-bold text-green-700">ILAVA</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Welcome back, Farmer!</h2>
            <p className="text-green-100 mb-4">
              Turn your agricultural waste into valuable income with ILAVA
            </p>
            <Button 
              variant="secondary" 
              onClick={() => setLocation('/sell-waste')}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              List New Waste
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
            <CardTitle>Recent Listings</CardTitle>
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
                    <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'}>
                      {listing.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Listings
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => setLocation('/sell-waste')}>
            <CardContent className="p-6 text-center">
              <FaCamera className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Scan & Sell Waste</h3>
              <p className="text-sm text-gray-600">Use AI to identify and price your waste</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setLocation('/my-orders')}>
            <CardContent className="p-6 text-center">
              <FaShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Manage Orders</h3>
              <p className="text-sm text-gray-600">Track and fulfill your orders</p>
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
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => setLocation('/categories')}
          >
            <FaLeaf className="h-5 w-5 mb-1" />
            <span className="text-xs">Categories</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => setLocation('/sell-waste')}
          >
            <div className="bg-green-600 rounded-full p-2 mb-1">
              <FaCamera className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs">Scan</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => setLocation('/cart')}
          >
            <FaShoppingCart className="h-5 w-5 mb-1" />
            <span className="text-xs">Cart</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => setLocation('/profile')}
          >
            <FaUser className="h-5 w-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
      <AIAssistant />
    </div>
  );
}