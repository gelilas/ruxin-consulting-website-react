import { Cursor } from '@/components/motion/cursor'
import { Navbar } from '@/components/site/navbar'
import { Story } from '@/components/site/story'
import { ServicesSection } from '@/components/services/services-section'
import { Clients } from '@/components/site/clients'
import { Testimonials } from '@/components/site/testimonials'
import { Team } from '@/components/site/team'
import { Careers } from '@/components/site/careers'
import { Insights } from '@/components/site/insights'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'
import { Assistant } from '@/components/site/assistant'

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
      <Navbar />
      <main id="main">
        <Story />
        <ServicesSection />
        <Clients />
        <Testimonials />
        <Team />
        <Careers />
        <Insights />
        <Contact />
      </main>
      <Footer />
      <Assistant />
    </>
  )
}
