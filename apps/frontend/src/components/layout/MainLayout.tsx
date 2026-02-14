import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  transparentNavbar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showFooter = true,
  transparentNavbar = false 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar transparent={transparentNavbar} />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
