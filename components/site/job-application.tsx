'use client'

import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Loader2, Paperclip, Send } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { submitApplication, type ApplicationState } from '@/lib/applications'
import { cn } from '@/lib/utils'
import { EASE } from '@/components/motion/primitives'

const field =
  'mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ruxin'

export function JobApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [state, setState] = useState<ApplicationState>({ status: 'idle' })
  const [fileName, setFileName] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const id = useId()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    form.set('jobId', jobId)
    form.set('jobTitle', jobTitle)

    setState({ status: 'submitting' })
    const result = await submitApplication(form)
    setState(result)

    if (result.status === 'success') {
      formRef.current?.reset()
      setFileName('')
    }
  }

  if (state.status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-2xl border border-ruxin/25 bg-white p-8 text-center"
        role="status"
      >
        <CheckCircle2 className="mx-auto size-10 text-ruxin" aria-hidden="true" />
        <h3 className="mt-5 text-xl font-semibold tracking-tight">Application received</h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-ink/65">{state.message}</p>
        <button
          type="button"
          onClick={() => setState({ status: 'idle' })}
          className="mt-6 text-sm text-ruxin underline underline-offset-4"
        >
          Submit another application
        </button>
      </motion.div>
    )
  }

  const busy = state.status === 'submitting'

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-2xl border border-ink/10 bg-white p-7 md:p-9">
      <h3 className="text-xl font-semibold tracking-tight">Apply for this role</h3>
      <p className="mt-2 text-sm text-ink/60">
        Fields marked with <span aria-hidden="true">*</span> are required.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Input id={`${id}-name`} name="fullName" label="Full name" required error={state.errors?.fullName} autoComplete="name" />
        <Input id={`${id}-email`} name="email" type="email" label="Email" required error={state.errors?.email} autoComplete="email" />
        <Input id={`${id}-phone`} name="phone" type="tel" label="Phone" required error={state.errors?.phone} autoComplete="tel" />
        <Input id={`${id}-linkedin`} name="linkedin" label="LinkedIn (optional)" error={state.errors?.linkedin} placeholder="https://linkedin.com/in/…" />
      </div>

      <div className="mt-5">
        <Input id={`${id}-portfolio`} name="portfolio" label="Portfolio or website (optional)" error={state.errors?.portfolio} placeholder="https://…" />
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-cover`} className="block text-sm font-medium">
          Why are you a good fit? <span className="text-ruxin" aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${id}-cover`}
          name="coverLetter"
          required
          rows={6}
          aria-invalid={Boolean(state.errors?.coverLetter)}
          aria-describedby={state.errors?.coverLetter ? `${id}-cover-error` : undefined}
          className={cn(field, 'min-h-36', state.errors?.coverLetter && 'border-ruxin')}
          placeholder="Tell us about your experience and why this role interests you."
        />
        {state.errors?.coverLetter && (
          <p id={`${id}-cover-error`} className="mt-1.5 text-xs text-ruxin">
            {state.errors.coverLetter}
          </p>
        )}
      </div>

      <div className="mt-5">
        <span className="block text-sm font-medium">CV / Résumé</span>
        <label
          className={cn(
            'mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-ink/25 px-4 py-4 text-sm transition-colors hover:border-ruxin',
            state.errors?.resume && 'border-ruxin',
          )}
        >
          <Paperclip className="size-4 shrink-0 text-ruxin" aria-hidden="true" />
          <span className={fileName ? 'text-ink' : 'text-ink/55'}>
            {fileName || 'Attach a PDF, DOC or DOCX (max 10 MB)'}
          </span>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
          />
        </label>
        {state.errors?.resume && <p className="mt-1.5 text-xs text-ruxin">{state.errors.resume}</p>}
      </div>

      <AnimatePresence>
        {state.status === 'error' && state.message && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 rounded-lg bg-ruxin/8 px-4 py-3 text-sm text-ruxin"
            role="alert"
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={busy}
        className="group mt-7 inline-flex h-13 w-full items-center justify-center gap-3 rounded-full bg-ruxin px-7 text-sm font-medium text-white transition-colors hover:bg-ruxin-bright disabled:cursor-not-allowed disabled:opacity-70"
      >
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Submit application
            <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </>
        )}
      </button>
      <p className="mt-4 text-center text-xs text-ink/50">
        We use your details only to assess this application.
      </p>
    </form>
  )
}

function Input({
  id,
  name,
  label,
  type = 'text',
  required = false,
  error,
  placeholder,
  autoComplete,
}: {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
  error?: string
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required && (
          <span className="text-ruxin" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(field, error && 'border-ruxin')}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-ruxin">
          {error}
        </p>
      )}
    </div>
  )
}
