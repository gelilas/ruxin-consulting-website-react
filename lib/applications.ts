import { cmsOrigin } from './media'

export type ApplicationState = {
  status: 'idle' | 'submitting' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<ApplicationField, string>>
}

export type ApplicationField =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'coverLetter'
  | 'linkedin'
  | 'portfolio'
  | 'resume'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Mirrors the server's document whitelist so we fail fast, before uploading. */
const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const RESUME_MAX_BYTES = 10 * 1024 * 1024

export function validateApplication(form: FormData): Partial<Record<ApplicationField, string>> {
  const errors: Partial<Record<ApplicationField, string>> = {}
  const value = (key: string) => String(form.get(key) ?? '').trim()

  if (value('fullName').length < 2) errors.fullName = 'Please enter your full name.'
  if (!EMAIL_RE.test(value('email'))) errors.email = 'Please enter a valid email address.'
  if (value('phone').length < 6) errors.phone = 'Please enter a phone number we can reach you on.'
  if (value('coverLetter').length < 30) {
    errors.coverLetter = 'Please tell us a little more (30+ characters).'
  }

  const resume = form.get('resume')
  if (resume instanceof File && resume.size > 0) {
    if (!RESUME_TYPES.includes(resume.type)) errors.resume = 'Attach a PDF, DOC or DOCX file.'
    else if (resume.size > RESUME_MAX_BYTES) errors.resume = 'Your CV must be 10 MB or smaller.'
  }

  return errors
}

export async function submitApplication(form: FormData): Promise<ApplicationState> {
  const errors = validateApplication(form)
  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, message: 'Please check the highlighted fields.' }
  }

  try {
    const response = await fetch(`${cmsOrigin}/api/applications`, { method: 'POST', body: form })
    const data = (await response.json().catch(() => ({}))) as { error?: string; notified?: boolean }

    if (!response.ok) {
      return {
        status: 'error',
        message: data.error || 'We could not submit your application. Please try again.',
      }
    }

    return {
      status: 'success',
      message: 'Thank you — your application is with our team. We will be in touch.',
    }
  } catch {
    return {
      status: 'error',
      message: 'We could not reach the server. Check your connection and try again.',
    }
  }
}
