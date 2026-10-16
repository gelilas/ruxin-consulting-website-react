export type ChatMessage = { role: 'user' | 'assistant'; content: string }
export type AssistantReply = { content: string; links?: { label: string; href: string }[] }

const replies: { match: RegExp; reply: AssistantReply }[] = [
  {
    match: /job|career|hiring|position|work (for|at|with)|vacanc/i,
    reply: {
      content:
        'Ruxin helps foreign investors establish and operate in Ethiopia. For roles, write to ruxinconsulting@gmail.com and the team will respond.',
      links: [{ label: 'Contact Ruxin', href: '#contact' }],
    },
  },
  {
    match: /contact|reach|email|phone|call|office|where/i,
    reply: {
      content:
        'Email ruxinconsulting@gmail.com, call +251 988 987 777, or visit Bole Rwanda, Fuad Building, Office no. 301 in Addis Ababa. You can also use the contact form.',
      links: [{ label: 'Open contact form', href: '#contact' }],
    },
  },
  {
    match: /logistic|shipping|freight|supply|customs|transport/i,
    reply: {
      content:
        'We facilitate customs clearance by coordinating documentation and regulatory requirements, so import and export move with fewer delays.',
      links: [
        { label: 'Explore Logistics', href: '#services' },
        { label: 'Talk to the team', href: '#contact' },
      ],
    },
  },
  {
    match: /consult|strategy|growth|transform|market entry/i,
    reply: {
      content:
        'Our investment consultancy guides foreign investors through Ethiopia’s regulations, business registration, and licensing.',
      links: [
        { label: 'See how we work', href: '#services' },
        { label: 'Book a conversation', href: '#contact' },
      ],
    },
  },
  {
    match: /financ|invest|valuation|model|account/i,
    reply: {
      content:
        'We prepare monthly and annual financial reports in line with local regulations, so clients meet their reporting obligations.',
      links: [{ label: 'Explore Finance', href: '#services' }],
    },
  },
  {
    match: /legal|contract|compliance|law|regulat/i,
    reply: {
      content:
        'We provide legal guidance and document review so businesses can handle contracts and regulatory procedures with more confidence.',
      links: [{ label: 'Explore Legal', href: '#services' }],
    },
  },
  {
    match: /recruit|talent|hire|candidate|headhunt|executive search/i,
    reply: {
      content:
        'We support candidate sourcing, screening, and recruitment coordination so clients can build teams that fit their operations.',
      links: [{ label: 'Explore Recruitment', href: '#services' }],
    },
  },
  {
    match: /service|what do you do|offer|help/i,
    reply: {
      content:
        'Ruxin is a one-stop partner in Ethiopia: investment consultancy, customs clearing, financial reporting, recruitment, and legal advisory.',
      links: [{ label: 'Explore all services', href: '#services' }],
    },
  },
]

export async function requestAssistantReply(messages: ChatMessage[]): Promise<AssistantReply> {
  const last = messages.slice(-20).filter((m) => m.role === 'user').at(-1)
  if (!last || last.content.length > 2000) {
    throw new Error('Message is required')
  }
  await new Promise((r) => setTimeout(r, 650))
  return getMockReply(last.content)
}

export function getMockReply(input: string): AssistantReply {
  const hit = replies.find((r) => r.match.test(input))
  return (
    hit?.reply ?? {
      content:
        "Thanks for your message. I can tell you about our services, open roles, or how to reach the team. For anything specific, the Ruxin team would be glad to help directly.",
      links: [{ label: 'Contact Ruxin', href: '#contact' }],
    }
  )
}
