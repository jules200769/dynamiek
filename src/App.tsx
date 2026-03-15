/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GradualBlur from './components/GradualBlur';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Pricing from './components/Pricing';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Rijlessen from './pages/Rijlessen';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <GradualBlur
        position="bottom"
        height="7rem"
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
                <Services />
                <WhyUs />
                <Pricing />
                <Reviews />
                <FAQ />
                <Contact />
              </>
            }
          />
          <Route path="/rijlessen" element={<Rijlessen />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
