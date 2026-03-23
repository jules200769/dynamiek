/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
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
import PortalLayout from './components/portal/PortalLayout';
import OwnerLayout from './components/owner-portal/OwnerLayout';
import LoginGateway from './pages/portal/LoginGateway';
import PortalDashboardPage from './pages/portal/Dashboard';
import PortalAgendaPage from './pages/portal/Agenda';
import PortalHoursPage from './pages/portal/Hours';
import PortalBillingPage from './pages/portal/Billing';
import PortalProfilePage from './pages/portal/Profile';
import PortalProgressPage from './pages/portal/Progress';
import PortalMessagesPage from './pages/portal/Messages';
import OwnerDashboardPage from './pages/owner-portal/Dashboard';
import OwnerStudentsPage from './pages/owner-portal/Students';
import OwnerStudentDetailPage from './pages/owner-portal/StudentDetail';
import OwnerPlanningPage from './pages/owner-portal/Planning';
import OwnerHoursPage from './pages/owner-portal/Hours';
import OwnerProgressPage from './pages/owner-portal/Progress';
import OwnerBillingPage from './pages/owner-portal/Billing';
import OwnerMessagesPage from './pages/owner-portal/Messages';
import OwnerCalendarSyncPage from './pages/owner-portal/CalendarSync';
import { RequireAuth, RequireOwner } from './components/auth/RouteGuards';

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

function PageTransition({ children }: { children: ReactNode }) {
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

function PublicRoutes() {
  return (
    <>
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
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginGateway />} />
      <Route
        path="/portaal"
        element={
          <RequireAuth>
            <PortalLayout />
          </RequireAuth>
        }
      >
        <Route index element={<PortalDashboardPage />} />
        <Route path="agenda" element={<PortalAgendaPage />} />
        <Route path="uren" element={<PortalHoursPage />} />
        <Route path="betalingen" element={<PortalBillingPage />} />
        <Route path="profiel" element={<PortalProfilePage />} />
        <Route path="voortgang" element={<PortalProgressPage />} />
        <Route path="berichten" element={<PortalMessagesPage />} />
      </Route>
      <Route
        path="/owner"
        element={
          <RequireOwner>
            <OwnerLayout />
          </RequireOwner>
        }
      >
        <Route index element={<OwnerDashboardPage />} />
        <Route path="leerlingen" element={<OwnerStudentsPage />} />
        <Route path="leerlingen/:studentId" element={<OwnerStudentDetailPage />} />
        <Route path="planning" element={<OwnerPlanningPage />} />
        <Route path="uren" element={<OwnerHoursPage />} />
        <Route path="voortgang" element={<OwnerProgressPage />} />
        <Route path="facturatie" element={<OwnerBillingPage />} />
        <Route path="berichten" element={<OwnerMessagesPage />} />
        <Route path="calendar-sync" element={<OwnerCalendarSyncPage />} />
      </Route>
      {PublicRoutes()}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const location = useLocation();
  const portalMode = useMemo(
    () =>
      location.pathname.startsWith('/portaal') ||
      location.pathname.startsWith('/owner') ||
      location.pathname.startsWith('/login'),
    [location.pathname],
  );

  return (
    <div className="min-h-screen flex flex-col">
      {!portalMode ? (
        <>
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
        </>
      ) : null}
      <ScrollToTop />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {!portalMode ? (
        <>
          <FloatingActions />
          <Footer />
        </>
      ) : null}
    </div>
  );
}
