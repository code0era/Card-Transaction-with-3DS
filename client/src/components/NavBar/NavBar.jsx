import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavBar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: '🏠', public: true },
  { to: '/flow', label: 'Flow Explorer', icon: '🔍', public: false },
  { to: '/simulation', label: 'Simulation', icon: '⚡', public: false },
  { to: '/comparison', label: '3DS v1 vs v2', icon: '⚖️', public: false },
  { to: '/history', label: 'History', icon: '📊', public: false },
  { to: '/docs', label: 'Documentation', icon: '📄', public: true },
];

export default function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const visibleLinks = NAV_LINKS.filter(l => l.public || isAuthenticated);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⬡</span>
          <span className="navbar__logo-text">
            <span className="gradient-text">3DS</span> Visualizer
          </span>
        </NavLink>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {visibleLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                end={link.to === '/'}
              >
                <span className="navbar__link-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Actions */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__user">
              <div className="navbar__avatar">{user.name[0].toUpperCase()}</div>
              <span className="navbar__username">{user.name}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="navbar__auth-btns">
              <NavLink to="/login" className="btn btn-ghost btn-sm">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        {visibleLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
            end={link.to === '/'}
          >
            <span>{link.icon}</span> {link.label}
          </NavLink>
        ))}
        <div className="navbar__mobile-auth">
          {isAuthenticated ? (
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-secondary btn-sm">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
