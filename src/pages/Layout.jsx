
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, TrendingUp, Briefcase, Users, Sparkles, Sun, Moon, Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Beams from "@/components/ui/Beams";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const path = location.pathname.toLowerCase();
  const isLandingPage = 
    currentPageName === 'Landing' || 
    currentPageName === 'index' ||
    currentPageName === 'Application' || 
    currentPageName === 'MeetOrion' || 
    currentPageName === 'CreateAccount' || 
    path === '/' || 
    path.includes('landing') || 
    path.includes('meetorion') || 
    path.includes('application') ||
    path.includes('createaccount');

  // Pages where Plasma should be active
  const plasmaPages = ['Dashboard', 'Trade', 'Portfolio', 'Social', 'Settings', 'Orion', 'Account', 'TraderProfile'];
  // Check if current page is in the list (checking both currentPageName and path for robustness)
  const showPlasma = plasmaPages.includes(currentPageName) || 
    plasmaPages.some(p => path.includes(p.toLowerCase()));

  useEffect(() => {
  }, [location.pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
  }, []);

  const navigationItems = [
    { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
    { title: "Trade", url: createPageUrl("Trade"), icon: TrendingUp },
    { title: "Portfolio", url: createPageUrl("Portfolio"), icon: Briefcase },
    { title: "Orion AI", url: createPageUrl("Orion"), icon: Sparkles },
    { title: "Social", url: createPageUrl("Social"), icon: Users },
    { title: "Settings", url: createPageUrl("Settings"), icon: Settings },
  ];

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 relative overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 bg-white dark:bg-[#030014] transition-colors duration-300" />
      
      {/* Background Beams Layer */}
      {showPlasma && (
        <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
          <Beams 
            beamWidth={30}
            beamHeight={100}
            beamNumber={2}
            lightColor={darkMode ? "#6d28d9" : "#6366f1"}
            baseColor={darkMode ? "#020617" : "#ffffff"}
            speed={0.1}
            noiseIntensity={0.6}
            scale={0.1}
            rotation={-45}
            spacing={0}
          />
        </div>
      )}
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-300">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl("Dashboard")}>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ce5d09cbce0fa35e3dca6/1f3c43b3b_image.png" 
              alt="Stoneforge" 
              className="h-10 cursor-pointer hidden dark:block"
            />
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ce5d09cbce0fa35e3dca6/b1ccc57d1_image.png" 
              alt="Stoneforge" 
              className="h-10 cursor-pointer block dark:hidden"
            />
          </Link>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <Link key={item.url} to={item.url}>
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black dark:bg-white rounded-full"></span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-400 hover:text-yellow-500 transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" />
              )}
            </Button>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800"></div>

            <Link to={createPageUrl("Account")}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Heading Bar (Mobile) */}
        <div className="lg:hidden px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <Link key={`head-${item.url}`} to={item.url} className="flex-shrink-0">
                  <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isActive 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav (Sliding) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-50">
        <nav className="h-16 flex items-center gap-2 px-4 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url;
            return (
              <Link key={item.url} to={item.url} className="flex-shrink-0">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isActive 
                    ? 'bg-black dark:bg-white text-white dark:text-black' 
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                }`}>
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{item.title}</span>
                </button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-20 lg:pt-16 lg:pb-0 relative z-10">
        {children}
      </div>
    </div>
  );
}
