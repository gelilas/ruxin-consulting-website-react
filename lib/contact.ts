export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  name?: string
  errors?: Partial<Record<'name' | 'email' | 'message', string>>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates contact submissions server-side.
 * Connect an email provider (e.g. Resend) or a database here to deliver/store messages.
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim().slice(0, 120)
  const email = String(formData.get('email') ?? '').trim().slice(0, 200)
  const message = String(formData.get('message') ?? '').trim().slice(0, 5000)

  const errors: ContactState['errors'] = {}
  if (name.length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.'
  if (message.length < 10) errors.message = 'Please tell us a little more (10+ characters).'

  if (Object.keys(errors).length) {
    return { status: 'error', errors, message: 'Please check the highlighted fields.' }
  }

  await new Promise((r) => setTimeout(r, 700))
  return { status: 'success', name: name.split(' ')[0] }
}
