import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MorrisOpozoLogo from '@/assets/logos/morris-opazo-logo.svg';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Frameworks', href: '/frameworks' },
  { name: 'Gestionar mi Proyecto', href: '/lifecycle' },
  { name: 'Governance', href: '/governance' },
  { name: 'Artefactos', href: '/artifacts' },
  { name: 'Herramientas', href: '/tools' },
  { name: 'Roles', href: '/roles' },
  { name: 'Descargas', href: '/downloads' },
];

export function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="container">
        <div className="site-header-inner flex justify-between items-center">
          <Link to="/" className="site-brand-lockup" onClick={() => setMenuOpen(false)}>
            <img 
              src={MorrisOpozoLogo} 
              alt="Morris & Opazo" 
              className="site-logo"
              width="180"
              height="40"
            />
            <span className="site-brand-subtitle">PMO Framework Hub</span>
          </Link>
          <nav className="site-desktop-nav" aria-label="Navegación principal">
            {navigation.map((item) => {
              const current = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              return <Link key={item.name} to={item.href} className={current ? 'site-nav-current' : 'site-nav-link'}>{item.name}</Link>;
            })}
          </nav>
          <a className="site-contact-link" href="https://morrisopazo.com/#contacto" target="_blank" rel="noreferrer">Contacto</a>
          <button className="site-menu-toggle" type="button" aria-expanded={menuOpen} aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>

        {menuOpen && (
          <nav className="site-mobile-nav" aria-label="Navegación principal">
            {navigation.map((item) => {
              const current = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              return <Link key={item.name} to={item.href} onClick={() => setMenuOpen(false)} className={current ? 'site-nav-current' : 'site-nav-link'}>{item.name}</Link>;
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
