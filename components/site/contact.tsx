'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Globe, Loader2, Mail, MapPin, Phone } from 'lucide-react'
import { useActionState, useEffect, useId, useRef } from 'react'
import { useSiteContent } from '@/lib/site-content'
import { trackAnalytics } from '@/lib/analytics'
import { submitContact, type ContactState } from '@/lib/contact'
import { cn } from '@/lib/utils'
import { useUiCopy } from '@/lib/ui-copy'
import { EASE, Eyebrow, Magnetic, Reveal, SplitHeading } from '@/components/motion/primitives'

const initial: ContactState = { status: 'idle' }

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  error,
  as = 'input',
  className,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  error?: string
  as?: 'input' | 'textarea'
  className?: string
}) {
  const id = useId()
  const errId = `${id}-err`
  const base =
    'peer w-full border-0 border-b border-white/30 bg-transparent px-0 pb-3 pt-7 text-base text-white placeholder-transparent outline-none transition-colors focus:border-white focus-visible:outline-none'
  return (
    <div className={cn('relative', className)}>
      {as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={cn(base, 'resize-none')}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={base}
        />
      )}
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-0 top-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/80 transition-colors peer-focus:text-white',
        )}
      >
        {label}
        {required && <span className="text-cream"> *</span>}
      </label>
      {error && (
        <p id={errId} className="mt-2 text-xs text-cream">
          {error}
        </p>
      )}
    </div>
  )
}

export function Contact() {
  const { company, services } = useSiteContent()
  const copy = useUiCopy()
  const [state, action, pending] = useActionState(submitContact, initial)
  const serviceId = useId()
  const selectedService = useRef('')

  useEffect(() => {
    if (state.status === 'success') {
      trackAnalytics('contact_form_submitted', { service: selectedService.current || undefined })
    }
  }, [state.status])

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden bg-ruxin py-24 text-white md:py-36">
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <Eyebrow dark mark="white" className="text-white/70">
            {copy.contact}
          </Eyebrow>
        </Reveal>
        <SplitHeading
          id="contact-heading"
          lines={copy.contactHeadline}
          accentLast
          accentClassName="text-white/80"
          className="mt-7 text-balance text-[clamp(3rem,9vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]"
        />

        <div className="mt-16 grid grid-cols-1 gap-16 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <img src="/profile/contact.jpg" alt="A Ruxin consultant speaking with a client" className="mb-8 aspect-[4/3] w-full object-cover" />
              <p className="max-w-sm text-pretty text-lg leading-relaxed text-white/75">
                {copy.contactIntro}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="mt-12 divide-y divide-white/20 border-y border-white/20">
                {[
                  { icon: Mail, label: copy.email, value: company.email, href: `mailto:${company.email}` },
                  { icon: Phone, label: copy.phone, value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
                  { icon: Globe, label: copy.website, value: 'www.ruxinconsulting.com', href: company.website },
                  { icon: MapPin, label: copy.location, value: company.location },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 py-5">
                    <Icon className="mt-0.5 size-4 text-white" aria-hidden="true" />
                    <div>
                      <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/80">{label}</dt>
                      <dd className="mt-1.5">
                        {href ? (
                          <a href={href} className="text-white transition-colors hover:text-cream">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-7 lg:col-start-6">
            <AnimatePresence mode="wait">
              {state.status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex min-h-[420px] flex-col items-start justify-center border border-white/25 p-8 md:p-12"
                  role="status"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-white text-ruxin">
                    <Check className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-3xl font-semibold tracking-tight">{copy.thankYou}{state.name ? `, ${state.name}` : ''}.</h3>
                  <p className="mt-3 max-w-md text-white/70">
                    {copy.messageSent}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  action={action}
                  noValidate
                  onSubmit={(event) => {
                    const form = new FormData(event.currentTarget)
                    selectedService.current = String(form.get('service') || '')
                    trackAnalytics('contact_form_started', { service: selectedService.current || undefined })
                  }}
                  className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2"
                  exit={{ opacity: 0 }}
                >
                  <Field label={copy.name} name="name" required autoComplete="name" error={state.errors?.name} />
                  <Field label={copy.email} name="email" type="email" required autoComplete="email" error={state.errors?.email} />
                  <Field label={copy.phone} name="phone" type="tel" autoComplete="tel" />
                  <Field label={copy.companyField} name="company" autoComplete="organization" />
                  <div className="relative md:col-span-2">
                    <label
                      htmlFor={serviceId}
                      className="absolute left-0 top-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/80"
                    >
                      {copy.service}
                    </label>
                    <select
                      id={serviceId}
                      name="service"
                      defaultValue=""
                      className={cn(
                        'w-full appearance-none border-0 border-b border-white/30 bg-transparent px-0 pb-3 pt-7 text-base text-white outline-none focus:border-white [&>option]:bg-cream [&>option]:text-ink',
                      )}
                    >
                      <option value="">{copy.selectService}</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                      <option value="Other">{copy.somethingElse}</option>
                    </select>
                    <span className="pointer-events-none absolute bottom-4 right-0 text-white/80" aria-hidden="true">
                      {'↓'}
                    </span>
                  </div>
                  <Field label={copy.message} name="message" as="textarea" required className="md:col-span-2" error={state.errors?.message} />
                  {state.status === 'error' && state.message && (
                    <p className="text-sm text-cream md:col-span-2" role="alert">
                      {state.message}
                    </p>
                  )}
                  <div className="md:col-span-2">
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={pending}
                        className="group inline-flex h-14 items-center gap-3 rounded-full bg-cream px-8 text-sm font-medium text-ink transition-colors hover:bg-white disabled:opacity-70"
                      >
                        {pending ? copy.sending : copy.startConversation}
                        {pending ? (
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-16 border-t border-white/20 pt-8 md:mt-24">
          <div className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
            <div>
              <Eyebrow dark mark="white" className="text-white/70">
                {copy.findUs}
              </Eyebrow>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                {copy.visitUs}
              </p>
            </div>
            <div className="overflow-hidden border border-white/25 bg-white/10">
              <iframe
                title="Ruxin Consulting location in Bole Rwanda, Addis Ababa"
                src={company.mapEmbedUrl}
                className="h-64 w-full border-0 grayscale-[20%] md:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={company.mapEmbedUrl}
                target="_blank"
                rel="noreferrer"
                data-analytics-event="map_clicked"
                className="block border-t border-white/20 px-4 py-3 text-xs text-white/75 transition-colors hover:text-white"
              >
                {copy.openMap}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
