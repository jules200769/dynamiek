/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import GradualBlur from './components/GradualBlur';
import Hero from './components/Hero';
import USPScroller from './components/USPScroller';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Pricing from './components/Pricing';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import Workwijze from './components/Workwijze';
import Rijlessen from './pages/Rijlessen';
import VeelGesteldeVragen from './pages/VeelGesteldeVragen';
import Blog from './pages/Blog';

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return null;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
  if (!isDesktop) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function BlogSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  return <Blog slug={slug} />;
}

function AnimatedRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageTransition>
            <>
              <Hero />
              <div className="hidden lg:block">
                <USPScroller />
              </div>
              <Services />
              <Workwijze />
              <WhyUs />
              <Pricing />
              <Reviews />
              <FAQ />
              <Contact />
            </>
          </PageTransition>
        }
      />
        <Route path="/rijlessen" element={<PageTransition><Rijlessen /></PageTransition>} />
        <Route path="/veel-gestelde-vragen" element={<PageTransition><VeelGesteldeVragen /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogSlugPage /></PageTransition>} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <GradualBlur
        position="bottom"
        height="3.5rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        fixed
        hideAtBottom
      />
      <Navbar />
      <ScrollToTop />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      <FloatingActions />
      <Footer />
    </div>
  );
}
