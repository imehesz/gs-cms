import React, { useState, useEffect } from 'react'
import { Navbar, Nav } from 'react-bootstrap'

import '../styles/navbar.css'

const CustomNavbar = ({ links, brand }) => {
  const defaultBrandObj = {}

  const defaultLinks = [];

  const [scrolled, setScrolled] = useState(false)

  const navLinks = links.length ? links : defaultLinks
  const brandObj = brand ? brand : defaultBrandObj

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

    const handleNavClick = (e, url = '') => {
        if (url.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(url);
            console.log(element)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (url.startsWith('http')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

  return (
    <div className={`nav-wrapper ${scrolled ? 'scrolled' : ''}`}>
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href={ brandObj.url }>{ brandObj.label }</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {navLinks.map((link, index) => (
            <Nav.Link
                key={index}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : '_self'}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(e, link.url)
                }}
            >
              {link.label}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </div>
  );
};

CustomNavbar.defaultProps = {
  links: []
};

export default CustomNavbar