'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025); 

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-light text-center text-muted py-3 mt-5">
      <div className="container">
        <small>&copy; {currentYear} Sistema de Gestión de Usuarios</small>
      </div>
    </footer>
  );
}