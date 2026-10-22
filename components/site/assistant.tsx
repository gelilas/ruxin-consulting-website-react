'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useSiteContent } from '@/lib/site-content'
import { requestAssistantReply, type AssistantReply, type ChatMessage } from '@/lib/assistant'
import { cn } from '@/lib/utils'
import { EASE } from '@/components/motion/primitives'
import { LogoMark } from '@/components/site/logo'

type UIMessage = ChatMessage & { id: number; links?: AssistantReply['links'] }

const LINK_RE = /(https?:\/\/[^\s<>()]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g

function linkify(text: string): ReactNode[] {
  const parts = text.split(LINK_RE)
  return parts.map((part, index) => {
    if (!part) return null
    if (part.startsWith('http://') || part.startsWith('https://')) {
      let url = part
      let trailing = ''
      while (url && '.,;:!?'.includes(url.at(-1) ?? '')) {
        trailing = url.at(-1) + trailing
        url = url.slice(0, -1)
      }
      return (
        <span key={index}>
          <a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {url}
          </a>
          {trailing}
        </span>
      )
    }
    if (part.includes('@')) {
      return (
        <a key={index} href={`mailto:${part}`} className="underline underline-offset-2">
          {part}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export function Assistant() {
  const { assistant, company } = useSiteContent()
  const welcome = assistant.welcome
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const idRef = useRef(1)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, pending])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function send(text: string) {
    const content = text.trim()
    if (!content || pending) return
    const userMsg: UIMessage = { id: idRef.current++, role: 'user', content }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setPending(true)
    try {
      const reply = await requestAssistantReply(history.map(({ role, content }) => ({ role, content })))
      setMessages((m) => [...m, { id: idRef.current++, role: 'assistant', content: reply.content, links: reply.links }])
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: idRef.current++,
          role: 'assistant',
          content: `Sorry, something went wrong. Please try again or email ${company.email}.`,
        },
      ])
    } finally {
      setPending(false)
    }
  }

  function resetConversation() {
    setMessages([])
    setInput('')
    inputRef.current?.focus()
  }

  const showSuggestions = messages.length === 0 && !pending

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ruxin Assistant"
            className="fixed inset-x-3 bottom-3 z-[70] flex max-h-[min(680px,calc(100dvh-24px))] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper text-ink shadow-[0_30px_80px_-20px_rgba(28,25,22,0.45)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[420px]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <header className="relative bg-[linear-gradient(118deg,var(--brand-wine-red)_0%,var(--brand-bright-red)_100%)] px-5 py-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <LogoMark light className="h-8 md:h-8" />
                  <p className="mt-3 font-heading text-xl font-semibold tracking-tight">Ruxin Assistant</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/90">
                    Ask about services, documents, and how to get started in Ethiopia.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    triggerRef.current?.focus()
                  }}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                  aria-label="Close assistant"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-[#7dffa8]">
                  <span className="size-1.5 rounded-full bg-[#42e892]" aria-hidden="true" />
                  Online
                </p>
                <button
                  type="button"
                  onClick={resetConversation}
                  className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-ruxin transition-colors hover:bg-white/90"
                >
                  + New conversation
                </button>
              </div>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {showSuggestions && (
                <>
                  <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm leading-relaxed text-ink/80 shadow-[0_4px_12px_rgba(26,18,20,0.04)]">
                    <span className="mr-1.5 font-semibold text-emerald-600" aria-hidden="true">
                      ●
                    </span>
                    {welcome}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {assistant.suggestions.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => send(s)}
                          className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-left text-sm leading-snug text-ink/80 transition-colors hover:border-ruxin/40 hover:bg-white"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}
                >
                  <div
                    className={cn(
                      'max-w-[88%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-[0_4px_12px_rgba(26,18,20,0.04)]',
                      m.role === 'user'
                        ? 'rounded-br-md border-transparent bg-ruxin text-white'
                        : 'rounded-bl-md border-ink/10 bg-white text-ink/85',
                    )}
                  >
                    <p className="text-pretty">{linkify(m.content)}</p>
                    {m.links && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              'rounded-full border px-3 py-1 text-xs transition-colors',
                              m.role === 'user'
                                ? 'border-white/30 text-white hover:bg-white/10'
                                : 'border-ink/10 text-ruxin hover:border-ruxin',
                            )}
                          >
                            {l.label} {'→'}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {pending && (
                <div
                  className="w-fit rounded-2xl rounded-bl-md border border-ink/10 bg-white px-4 py-3 text-sm text-mute"
                  aria-label="Assistant is typing"
                >
                  Looking that up…
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="border-t border-ink/10 bg-paper p-3"
            >
              <div className="flex items-center gap-2">
                <label htmlFor="assistant-input" className="sr-only">
                  Message Ruxin Assistant
                </label>
                <input
                  id="assistant-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
                  }}
                  placeholder="Ask your question"
                  maxLength={2000}
                  autoComplete="off"
                  className="h-12 flex-1 rounded-2xl border border-ink/10 bg-white px-4 text-sm text-ink placeholder:text-mute outline-none focus-visible:ring-1 focus-visible:ring-ruxin"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ruxin text-white transition-colors hover:bg-ruxin-bright disabled:opacity-40"
                  aria-label="Send message"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-mute">Answers use Ruxin’s services and contact details.</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <motion.button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
            className="group fixed bottom-5 right-5 z-[65] flex h-12 items-center gap-3 rounded-full border border-white/10 bg-charcoal pl-3 pr-5 text-sm font-medium text-white shadow-[0_20px_50px_-15px_rgba(28,25,22,0.35)] transition-colors hover:border-ruxin/60 md:bottom-6 md:right-6"
            aria-haspopup="dialog"
            aria-label="Ask Ruxin — open assistant"
          >
            <span className="relative flex size-6 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-ruxin/40 [animation-duration:2.2s]" aria-hidden="true" />
              <span className="relative size-2.5 rounded-full bg-ruxin" />
            </span>
            Ask Ruxin
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
