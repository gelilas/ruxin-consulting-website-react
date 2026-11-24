import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Cursor } from '@/components/motion/cursor'
import { Navbar } from '@/components/site/navbar'
import { Story } from '@/components/site/story'
import { ServicesSection } from '@/components/services/services-section'
import { Clients, WhyChoose } from '@/components/site/clients'
import { Team } from '@/components/site/team'
import { Careers, CareersPage, JobDetailPage } from '@/components/site/careers'
import { EventsSection, EventsPage, EventDetailPage } from '@/components/site/events'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'
import { AnalyticsTracker } from '@/lib/analytics'
// import { Assistant } from '@/components/site/assistant'

function Home() {
  return (
    <>
      <Story />
      <ServicesSection />
      <WhyChoose />
      <Team />
      <EventsSection />
      <Careers />
      <Clients />
      <Contact />
    </>
  )
}

/**
 * Router default is to keep the previous scroll position. Jump to the top on a
 * new page, but honour an in-page #anchor (the navbar links to /#about etc.).
 */
function ScrollBehaviour() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ruxin px-5 py-3 text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Cursor />
      <ScrollBehaviour />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:jobId" element={<JobDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <AnalyticsTracker />
      {/* Chatbot paused until the client-support workflow is ready. */}
      {/* <Assistant /> */}
    </>
  )
}
