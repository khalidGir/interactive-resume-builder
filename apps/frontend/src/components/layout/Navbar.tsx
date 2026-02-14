import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  FileText, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Zap
} from 'lucide-react';
import Button from '../ui/Button';

interface NavbarProps {
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLandingPage = location.pathname === '/';
  const shouldBeTransparent = transparent && isLandingPage && !isScrolled;

  const navLinks = isAuthenticated ? [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/resumes', label: 'My Resumes', icon: FileText },
  ] : [
    { to: '/templates', label: 'Templates', icon: null },
    { to: '/pricing', label: 'Pricing', icon: null },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${shouldBeTransparent 
          ? 'bg-transparent' 
          : 'bg-white/90 backdrop-blur-md shadow-sm'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${shouldBeTransparent ? 'bg-white/20' : 'bg-gradient-to-br from-primary-500 to-primary-600'}
            `}>
              <Sparkles className={`w-6 h-6 ${shouldBeTransparent ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`
              text-xl font-bold font-display
              ${shouldBeTransparent ? 'text-white' : 'text-gray-900'}
            `}>
              ResumeAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  text-sm font-medium transition-colors
                  ${shouldBeTransparent 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-gray-600 hover:text-primary-600'
                  }
                  ${location.pathname === link.to ? (shouldBeTransparent ? 'text-white' : 'text-primary-600') : ''}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                    ${shouldBeTransparent 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${shouldBeTransparent ? 'bg-white/20' : 'bg-primary-100'}
                  `}>
                    <User className={`w-4 h-4 ${shouldBeTransparent ? 'text-white' : 'text-primary-600'}`} />
                  </div>
                  <span className={`text-sm font-medium ${shouldBeTransparent ? 'text-white' : 'text-gray-700'}`}>
                    {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 ${shouldBeTransparent ? 'text-white/70' : 'text-gray-400'}`} />
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`
                    text-sm font-medium transition-colors
                    ${shouldBeTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                  `}
                >
                  Sign in
                </Link>
                <Button
                  variant={shouldBeTransparent ? 'white' : 'primary'}
                  size="sm"
                  onClick={() => navigate('/register')}
                  rightIcon={<Zap className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`
              md:hidden p-2 rounded-lg transition-colors
              ${shouldBeTransparent ? 'text-white' : 'text-gray-600'}
            `}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                  ${location.pathname === link.to 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-error-600 hover:bg-error-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
