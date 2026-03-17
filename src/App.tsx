/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
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
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
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
            }
          />
          <Route path="/rijlessen" element={<Rijlessen />} />
          <Route path="/veel-gestelde-vragen" element={<VeelGesteldeVragen />} />
        </Routes>
      </main>
      <FloatingActions />
      <Footer />
    </div>
  );
}
