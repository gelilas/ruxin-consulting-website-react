'use client'

import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { events as eventsShape } from '@/lib/content'
import { useSiteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { EASE, Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'
import { Media } from '@/components/ui/media'

type EventItem = (typeof eventsShape.items)[number]

/** Midnight today, so an event running later the same day still counts as upcoming. */
function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function isUpcoming(item: EventItem) {
  const end = item.endDate || item.date
  const parsed = new Date(end)
  if (Number.isNaN(parsed.getTime())) return true
  return parsed >= startOfToday()
}

export function formatEventDate(item: EventItem) {
  const start = new Date(item.date)
  if (Number.isNaN(start.getTime())) return item.date

  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const startLabel = start.toLocaleDateString('en-GB', opts)
  if (!item.endDate) return startLabel

  const end = new Date(item.endDate)
  if (Number.isNaN(end.getTime())) return startLabel
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} – ${end.toLocaleDateString('en-GB', opts)}`
}

function sortByDate(items: EventItem[], direction: 'asc' | 'desc') {
  return [...items].sort((a, b) => {
    const left = new Date(a.date).getTime() || 0
    const right = new Date(b.date).getTime() || 0
    return direction === 'asc' ? left - right : right - left
  })
}

/* -------------------------------------------------------------- home teaser */

export function EventsSection() {
  const { events } = useSiteContent()
  const upcoming = sortByDate(events.items.filter(isUpcoming), 'asc').slice(0, 3)
  if (events.items.length === 0) return null

  return (
    <section id="events" aria-labelledby="events-heading" className="bg-paper py-24 text-ink md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>{events.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading
              id="events-heading"
              lines={events.headline}
              accentLast
              accentClassName="text-ruxin"
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-xl text-pretty text-lg text-ink/65">{events.body}</p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-medium transition-colors hover:border-ruxin hover:text-ruxin"
            >
              All events
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        {upcoming.length === 0 ? (
          <p className="mt-14 border-t border-ink/10 pt-10 text-ink/60">
            No upcoming events right now — past sessions are in the{' '}
            <Link to="/events" className="text-ruxin underline underline-offset-4">
              events archive
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((item, i) => (
              <Reveal as="li" key={item.id} delay={i * 0.08}>
                <EventCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function EventCard({ item }: { item: EventItem }) {
  return (
    <Link
      to={`/events/${item.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-colors hover:border-ruxin/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-stone">
        {item.image || item.video ? (
          <Media
            image={item.image}
            video={item.video}
            paused
            alt=""
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute left-4 top-4 rounded-full bg-ruxin px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
          {item.category}
        </span>
        {!isUpcoming(item) && (
          <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
            Past
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ruxin">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {formatEventDate(item)}
        </p>
        <h3 className="mt-3 text-balance text-xl font-semibold leading-tight tracking-tight">{item.title}</h3>
        <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-ink/65">{item.summary}</p>
        <p className="mt-5 flex items-center gap-2 text-xs text-ink/60">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {item.location}
        </p>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------- listing page */

export function EventsPage() {
  const { events } = useSiteContent()
  const upcoming = sortByDate(events.items.filter(isUpcoming), 'asc')
  const past = sortByDate(events.items.filter((item) => !isUpcoming(item)), 'desc')

  return (
    <div className="bg-paper pb-24 pt-32 text-ink md:pb-32 md:pt-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Eyebrow>{events.eyebrow}</Eyebrow>
        <SplitHeading
          as="h1"
          lines={events.headline}
          accentLast
          accentClassName="text-ruxin"
          className="mt-7 max-w-4xl text-balance text-[clamp(2.4rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
        />
        <p className="mt-6 max-w-2xl text-pretty text-lg text-ink/65">{events.body}</p>

        <EventGroup title="Upcoming" items={upcoming} empty="Nothing scheduled at the moment. Check back soon." />
        {past.length > 0 && <EventGroup title="Past events" items={past} />}
      </div>
    </div>
  )
}

function EventGroup({ title, items, empty }: { title: string; items: EventItem[]; empty?: string }) {
  return (
    <section className="mt-16">
      <h2 className="flex items-center justify-between border-b border-ink/10 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/65">
        <span>{title}</span>
        <span>{String(items.length).padStart(2, '0')}</span>
      </h2>
      {items.length === 0 ? (
        <p className="mt-8 text-ink/60">{empty}</p>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal as="li" key={item.id} delay={i * 0.06}>
              <EventCard item={item} />
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  )
}

/* -------------------------------------------------------------- detail page */

export function EventDetailPage() {
  const { eventId } = useParams()
  const { events } = useSiteContent()
  const item = events.items.find((event) => event.id === eventId)

  if (!item) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-40 text-ink md:px-10">
        <h1 className="text-3xl font-semibold tracking-tight">We could not find that event.</h1>
        <p className="mt-4 text-ink/65">It may have been removed or the link may be out of date.</p>
        <Link to="/events" className="mt-8 inline-flex items-center gap-2 text-ruxin underline underline-offset-4">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to all events
        </Link>
      </div>
    )
  }

  const upcoming = isUpcoming(item)

  return (
    <article className="bg-paper pb-24 text-ink md:pb-32">
      <header className="relative flex min-h-[60svh] items-end overflow-hidden bg-ruxin text-white">
        {item.image || item.video ? (
          <Media image={item.image} video={item.video} alt="" className="absolute inset-0 size-full object-cover opacity-55" />
        ) : null}
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mx-auto w-full max-w-[1440px] px-5 pb-14 pt-36 md:px-10"
        >
          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            All events
          </Link>
          <p className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">
              {item.category}
            </span>
            <span
              className={cn(
                'rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]',
                upcoming ? 'bg-white text-ruxin' : 'bg-black/50 text-white/80',
              )}
            >
              {upcoming ? 'Upcoming' : 'Past'}
            </span>
          </p>
          <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
            {item.title}
          </h1>
        </motion.div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-14 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-pretty text-xl leading-relaxed text-ink/75">{item.summary}</p>
          <div className="mt-8 space-y-5 text-pretty leading-relaxed text-ink/70">
            {item.description.split('\n').filter(Boolean).map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5 lg:pl-8">
          <dl className="space-y-6 rounded-2xl border border-ink/10 bg-white p-7">
            <Detail icon={<CalendarDays className="size-4" />} label="Date" value={formatEventDate(item)} />
            {item.time && <Detail icon={<Clock className="size-4" />} label="Time" value={item.time} />}
            <Detail icon={<MapPin className="size-4" />} label="Location" value={item.location} />
          </dl>
          {upcoming && item.registerUrl && (
            <a
              href={item.registerUrl.startsWith('#') ? `/${item.registerUrl}` : item.registerUrl}
              className="group mt-6 inline-flex h-13 w-full items-center justify-center gap-3 rounded-full bg-ruxin px-7 text-sm font-medium text-white transition-colors hover:bg-ruxin-bright"
            >
              {item.registerLabel || 'Register'}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          )}
        </aside>
      </div>
    </article>
  )
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 shrink-0 text-ruxin" aria-hidden="true">
        {icon}
      </span>
      <div>
        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{label}</dt>
        <dd className="mt-1 text-sm text-ink/80">{value}</dd>
      </div>
    </div>
  )
}
