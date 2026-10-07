export type ChatMessage = { role: 'user' | 'assistant'; content: string }
export type AssistantReply = { content: string; links?: { label: string; href: string }[] }

const replies: { match: RegExp; reply: AssistantReply }[] = [
  {
    match: /job|career|hiring|position|work (for|at|with)|vacanc/i,
    reply: {
      content:
        "We're hiring across consulting, logistics, recruitment, finance, and legal. Current openings include Senior Business Consultant, Logistics Operations Manager, and Financial Analyst. You can browse every role and apply directly in the Careers section.",
      links: [{ label: 'View open roles', href: '#careers' }],
    },
  },
  {
    match: /contact|reach|email|phone|call|office|where/i,
    reply: {
      content:
        "You can email us at hello@ruxinconsulting.com or visit us in Addis Ababa, Ethiopia. The fastest way is the contact form — tell us about your challenge and we'll respond within one business day.",
      links: [{ label: 'Open contact form', href: '#contact' }],
    },
  },
  {
    match: /logistic|shipping|freight|supply|customs|transport/i,
    reply: {
      content:
        'Our logistics practice designs and manages cross-border supply chains — freight coordination, customs and clearance, warehousing, and supply chain design. Would you like to discuss a specific route or challenge?',
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
        'Ruxin Consulting helps leadership teams move from challenge to clear direction: business strategy, market entry, operational excellence, and transformation. Most engagements begin with a short diagnostic conversation.',
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
        'Our finance team provides financial advisory, modelling and valuation, reporting, and investment readiness support — turning your numbers into decisions.',
      links: [{ label: 'Explore Finance', href: '#services' }],
    },
  },
  {
    match: /legal|contract|compliance|law|regulat/i,
    reply: {
      content:
        'Our legal advisory covers contract review, corporate compliance, regulatory advisory, and risk assessment — so you can move forward with confidence.',
      links: [{ label: 'Explore Legal', href: '#services' }],
    },
  },
  {
    match: /recruit|talent|hire|candidate|headhunt|executive search/i,
    reply: {
      content:
        'We connect organizations with leaders and specialists through executive search, specialist hiring, talent mapping, and workforce planning.',
      links: [{ label: 'Explore Recruitment', href: '#services' }],
    },
  },
  {
    match: /service|what do you do|offer|help/i,
    reply: {
      content:
        'Ruxin brings five connected capabilities together: Consulting, Logistics, Recruitment, Finance, and Legal. Many clients combine several — for example, a market-entry strategy supported by logistics setup, hiring, and legal structuring.',
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
