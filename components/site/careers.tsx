'use client'

import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { careers as careersShape } from '@/lib/content'
import { useSiteContent } from '@/lib/site-content'
import { useUiCopy } from '@/lib/ui-copy'
import { EASE, Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'
import { JobApplicationForm } from '@/components/site/job-application'
import { motion } from 'motion/react'

type Job = (typeof careersShape.jobs)[number]

/* -------------------------------------------------------------- home teaser */

export function Careers() {
  const { careers } = useSiteContent()
  const copy = useUiCopy()

  return (
    <section id="careers" aria-labelledby="careers-heading" className="relative overflow-hidden bg-stone py-24 text-ink md:py-36">
      <div className="pointer-events-none absolute inset-0 grid-fine-dark opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow dark>{copy.careers}</Eyebrow>
            </Reveal>
            <SplitHeading
              id="careers-heading"
              lines={[careers.headline]}
              accentLast
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-md text-pretty text-lg leading-relaxed text-ink/60">{careers.body}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <ul className="mt-10 space-y-3 border-t border-ink/10 pt-8">
                {careers.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-ink/70">
                    <span className="size-1 rounded-full bg-ruxin" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="flex items-center justify-between border-b border-ink/10 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/65">
                <span>{copy.openPositions}</span>
                <span>
                  {String(careers.jobs.length).padStart(2, '0')} {copy.roles}
                </span>
              </p>
            </Reveal>
            {careers.jobs.length === 0 ? (
              <p className="mt-8 text-ink/60">No open positions right now — check back soon.</p>
            ) : (
              <ul>
                {careers.jobs.map((job, i) => (
                  <Reveal as="li" key={job.id} delay={i * 0.06}>
                    <JobRow job={job} />
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function JobRow({ job }: { job: Job }) {
  return (
    <Link
      to={`/careers/${job.id}`}
      className="group relative flex w-full flex-col gap-4 overflow-hidden border-b border-ink/10 py-7 text-left md:flex-row md:items-center md:justify-between"
    >
      <span className="absolute inset-0 origin-left scale-x-0 bg-ruxin/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" aria-hidden="true" />
      <span className="relative">
        <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin">
          {job.department}
        </span>
        <span className="mt-2 block text-xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">
          {job.title}
        </span>
        <span className="mt-2 block max-w-lg text-sm text-ink/70">{job.summary}</span>
      </span>
      <span className="relative flex shrink-0 items-center gap-5 text-xs text-ink/70">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden="true" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {job.type}
        </span>
        <span className="flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-ruxin group-hover:bg-ruxin group-hover:text-white">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </span>
    </Link>
  )
}

/* ------------------------------------------------------------- listing page */

export function CareersPage() {
  const { careers } = useSiteContent()
  const copy = useUiCopy()

  return (
    <div className="bg-paper pb-24 pt-32 text-ink md:pb-32 md:pt-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Eyebrow>{copy.careers}</Eyebrow>
        <SplitHeading
          as="h1"
          lines={[careers.headline]}
          accentLast
          accentClassName="text-ruxin"
          className="mt-7 max-w-4xl text-balance text-[clamp(2.4rem,5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
        />
        <p className="mt-6 max-w-2xl text-pretty text-lg text-ink/65">{careers.body}</p>

        <ul className="mt-10 flex flex-wrap gap-3">
          {careers.benefits.map((benefit) => (
            <li key={benefit} className="rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/70">
              {benefit}
            </li>
          ))}
        </ul>

        <h2 className="mt-16 flex items-center justify-between border-b border-ink/10 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/65">
          <span>{copy.openPositions}</span>
          <span>
            {String(careers.jobs.length).padStart(2, '0')} {copy.roles}
          </span>
        </h2>
        {careers.jobs.length === 0 ? (
          <p className="mt-8 text-ink/60">
            No open positions right now. We still welcome speculative applications —{' '}
            <Link to="/#contact" className="text-ruxin underline underline-offset-4">
              get in touch
            </Link>
            .
          </p>
        ) : (
          <ul>
            {careers.jobs.map((job, i) => (
              <Reveal as="li" key={job.id} delay={i * 0.06}>
                <JobRow job={job} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- detail page */

export function JobDetailPage() {
  const { jobId } = useParams()
  const { careers } = useSiteContent()
  const job = careers.jobs.find((item) => item.id === jobId)

  if (!job) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-40 text-ink md:px-10">
        <h1 className="text-3xl font-semibold tracking-tight">We could not find that role.</h1>
        <p className="mt-4 text-ink/65">It may have been filled or the link may be out of date.</p>
        <Link to="/careers" className="mt-8 inline-flex items-center gap-2 text-ruxin underline underline-offset-4">
          <ArrowLeft className="size-4" aria-hidden="true" />
          See all open positions
        </Link>
      </div>
    )
  }

  return (
    <article className="bg-paper pb-24 text-ink md:pb-32">
      <header className="bg-ruxin pb-16 pt-32 text-white md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-[1440px] px-5 md:px-10"
        >
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            All positions
          </Link>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">{job.department}</p>
          <h1 className="mt-4 max-w-4xl text-balance text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
            {job.title}
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/85">
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {job.location}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4" aria-hidden="true" />
              {job.type}
            </span>
          </p>
          <a
            href="#apply"
            className="group mt-9 inline-flex h-13 items-center gap-3 rounded-full bg-white px-7 text-sm font-medium text-ruxin transition-colors hover:bg-cream"
          >
            Apply for this role
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </motion.div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-16 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-pretty text-xl leading-relaxed text-ink/75">{job.summary}</p>
          <div className="mt-8 space-y-5 text-pretty leading-relaxed text-ink/70">
            {job.description.split('\n').filter(Boolean).map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <JobList title="What you will do" items={job.responsibilities} />
          <JobList title="What we are looking for" items={job.requirements} />
        </div>

        <div className="lg:col-span-5" id="apply">
          <div className="lg:sticky lg:top-28">
            <JobApplicationForm jobId={job.id} jobTitle={job.title} />
          </div>
        </div>
      </div>
    </article>
  )
}

function JobList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <section className="mt-12">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/65">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-pretty leading-relaxed text-ink/75">
            <span className="mt-2.5 size-1 shrink-0 rounded-full bg-ruxin" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
