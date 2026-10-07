'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Loader2, Mail, MapPin, Phone } from 'lucide-react'
import { useActionState, useId } from 'react'
import { useSiteContent } from '@/lib/site-content'
import { submitContact, type ContactState } from '@/lib/contact'
import { cn } from '@/lib/utils'
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
    'peer w-full border-0 border-b border-white/15 bg-transparent px-0 pb-3 pt-7 text-base text-white placeholder-transparent outline-none transition-colors focus:border-ruxin focus-visible:outline-none'
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
        className="pointer-events-none absolute left-0 top-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/45 transition-colors peer-focus:text-ruxin"
      >
        {label}
        {required && <span className="text-ruxin"> *</span>}
      </label>
      {error && (
        <p id={errId} className="mt-2 text-xs text-ruxin-bright">
          {error}
        </p>
      )}
    </div>
  )
}

export function Contact() {
  const { company, services } = useSiteContent()
  const [state, action, pending] = useActionState(submitContact, initial)
  const serviceId = useId()

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden bg-ink py-24 text-white md:py-36">
      <div
        className="pointer-events-none absolute -right-40 top-0 size-[720px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(176,22,30,0.6), transparent 65%)' }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 grid-fine [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <Eyebrow dark>Contact</Eyebrow>
        </Reveal>
        <SplitHeading
          id="contact-heading"
          lines={["Let's build", "what's next."]}
          accentLast
          accentClassName="text-ruxin"
          className="mt-7 text-balance text-[clamp(3rem,9vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]"
        />

        <div className="mt-16 grid grid-cols-1 gap-16 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="max-w-sm text-pretty text-lg leading-relaxed text-white/65">
                Have a challenge, opportunity, or idea? {"Let's"} start a conversation.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="mt-12 divide-y divide-white/10 border-y border-white/10">
                {[
                  { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
                  { icon: Phone, label: 'Phone', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
                  { icon: MapPin, label: 'Location', value: company.location },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 py-5">
                    <Icon className="mt-0.5 size-4 text-ruxin" aria-hidden="true" />
                    <div>
                      <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40">{label}</dt>
                      <dd className="mt-1.5">
                        {href ? (
                          <a href={href} className="text-white transition-colors hover:text-ruxin-bright">
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
                  className="flex min-h-[420px] flex-col items-start justify-center border border-white/10 p-8 md:p-12"
                  role="status"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-ruxin">
                    <Check className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-3xl font-semibold tracking-tight">Thank you{state.name ? `, ${state.name}` : ''}.</h3>
                  <p className="mt-3 max-w-md text-white/60">
                    Your message is on its way. A member of the Ruxin team will be in touch within one business day.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" action={action} noValidate className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2" exit={{ opacity: 0 }}>
                  <Field label="Name" name="name" required autoComplete="name" error={state.errors?.name} />
                  <Field label="Email" name="email" type="email" required autoComplete="email" error={state.errors?.email} />
                  <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
                  <Field label="Company" name="company" autoComplete="organization" />
                  <div className="relative md:col-span-2">
                    <label htmlFor={serviceId} className="absolute left-0 top-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/45">
                      Service
                    </label>
                    <select
                      id={serviceId}
                      name="service"
                      defaultValue=""
                      className="w-full appearance-none border-0 border-b border-white/15 bg-transparent px-0 pb-3 pt-7 text-base text-white outline-none focus:border-ruxin [&>option]:bg-charcoal"
                    >
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                      <option value="Other">Something else</option>
                    </select>
                    <span className="pointer-events-none absolute bottom-4 right-0 text-white/40" aria-hidden="true">
                      {'↓'}
                    </span>
                  </div>
                  <Field label="Message" name="message" as="textarea" required className="md:col-span-2" error={state.errors?.message} />
                  {state.status === 'error' && state.message && (
                    <p className="text-sm text-ruxin-bright md:col-span-2" role="alert">
                      {state.message}
                    </p>
                  )}
                  <div className="md:col-span-2">
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={pending}
                        className="group inline-flex h-14 items-center gap-3 rounded-full bg-ruxin px-8 text-sm font-medium text-white transition-colors hover:bg-ruxin-bright disabled:opacity-70"
                      >
                        {pending ? 'Sending…' : 'Start a Conversation'}
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
      </div>
    </section>
  )
}
