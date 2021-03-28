import React from 'react';
import HeaderApp from '../components/layout/HeaderApp';
import Footer from '../components/layout/Footer';

const LayoutApp= ({ children }) => (
  <>
    <main className="site-content">
      {children}
    </main>
    <Footer />
  </>
);

export default LayoutApp;
