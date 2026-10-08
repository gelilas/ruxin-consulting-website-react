'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSiteContent } from '@/lib/site-content'
import { requestAssistantReply, type AssistantReply, type ChatMessage } from '@/lib/assistant'
import { cn } from '@/lib/utils'
import { EASE } from '@/components/motion/primitives'

type UIMessage = ChatMessage & { id: number; links?: AssistantReply['links'] }

export function Assistant() {
  const { assistant } = useSiteContent()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<UIMessage[]>([{ id: 0, role: 'assistant', content: assistant.welcome }])
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
        { id: idRef.current++, role: 'assistant', content: 'Sorry, something went wrong. Please try again or email hello@ruxinconsulting.com.' },
      ])
    } finally {
      setPending(false)
    }
  }

  const showSuggestions = messages.length === 1

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ruxin Assistant"
            className="fixed inset-x-3 bottom-3 z-[70] flex max-h-[min(640px,calc(100dvh-24px))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-charcoal text-white shadow-[0_30px_80px_-20px_rgba(28,25,22,0.45)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <header className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="pointer-events-none absolute inset-0 grid-fine opacity-60" aria-hidden="true" />
              <div className="relative flex items-center gap-3">
                <span className="relative flex size-9 items-center justify-center rounded-full border border-white/15">
                  <span className="size-2 rounded-full bg-ruxin" />
                  <span className="absolute inset-0 animate-ping rounded-full border border-ruxin/40 [animation-duration:2.4s]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Ruxin Assistant</p>
                  <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    Online
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  triggerRef.current?.focus()
                }}
                className="relative flex size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close assistant"
              >
                <X className="size-4" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}
                >
                  <p
                    className={cn(
                      'max-w-[85%] text-pretty rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      m.role === 'user' ? 'rounded-br-sm bg-ruxin text-white' : 'rounded-bl-sm bg-white/[0.06] text-white/85',
                    )}
                  >
                    {m.content}
                  </p>
                  {m.links && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-ruxin hover:text-white"
                        >
                          {l.label} {'→'}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {pending && (
                <div className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-white/[0.06] px-4 py-4" aria-label="Assistant is typing">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="size-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
              {showSuggestions && (
                <div className="pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">Suggested</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {assistant.suggestions.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => send(s)}
                          className="group flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-white/80 transition-colors hover:border-white/25 hover:bg-white/[0.04]"
                        >
                          {s}
                          <span className="text-ruxin transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                            {'→'}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
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
                placeholder="Ask about services, careers…"
                maxLength={2000}
                autoComplete="off"
                className="h-11 flex-1 rounded-full bg-white/[0.06] px-4 text-sm text-white placeholder:text-white/35 outline-none focus-visible:ring-1 focus-visible:ring-ruxin"
              />
              <button
                type="submit"
                disabled={!input.trim() || pending}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ruxin text-white transition-colors hover:bg-ruxin-bright disabled:opacity-40"
                aria-label="Send message"
              >
                <ArrowUp className="size-4" />
              </button>
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
