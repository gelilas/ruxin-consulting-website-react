# Ruxin Website Analytics Brief
1
## In simple terms

This document explains how we can understand the performance of the Ruxin website.

It will help answer questions such as:

- Which countries are visitors coming from?
- Which parts of the website do people read?
- Which Ruxin service gets the most interest?
- Are people clicking the phone number, email, map, or contact button?
- Are visitors mostly using phones or computers?

This is normal website analytics. It is not a customer-registration system, client portal, or system for tracking private client information.

## Goal

Measure how people use the Ruxin website so the team can understand:

- Where visitors come from.
- Which pages and sections they read.
- Which services receive the most interest.
- Which actions lead people to contact Ruxin.
- Which devices and locations need the best experience.

This is website analytics only. It is not a client-registration system, CRM, or investor portal.

## Important concerns and limitations

These points should be understood before interpreting the reports:

- The website now includes a first-party analytics tracker that sends anonymous events to the Ruxin CMS. It still needs the CMS database schema to be pushed before reports can appear.
- Because this is a one-page website, most visitors will appear under one homepage URL. The useful report will therefore focus on sections and services, not traditional page rankings.
- Visitor location is approximate. It can usually show a country and sometimes a city, but it cannot reliably identify a person’s exact location.
- A service view or service click shows interest. It does not prove that someone wants to purchase that service.
- A contact-form submission should only be counted as a real lead after the form is connected to email delivery or a database. The current form validates the information but does not yet deliver or save the inquiry.
- All numbers in the dashboard example are examples only. They are not Ruxin’s real results.
- Analytics should not collect names, email addresses, phone numbers, or the private message written in the contact form.
- A privacy notice and consent message may be required depending on the analytics provider and the visitors’ countries.

## What the client will receive

The final analytics report should be a simple dashboard with:

1. Visitor summary — how many people visited and how often.
2. Visitor locations — the main countries or regions, shown in aggregate.
3. Website sections — which sections people reached or viewed.
4. Service interest — which services received the most views and clicks.
5. Traffic sources — Google, social media, direct visits, or referral websites.
6. Contact actions — form submissions, phone clicks, email clicks, and map clicks.
7. Device breakdown — mobile, desktop, and tablet usage.

The report should use simple labels and charts. It should not be a complicated business system.

## Recommended tool

Use a privacy-focused analytics tool such as Plausible for the first version. It can report pages, countries, cities, referrers, devices, and custom goals without turning the public website into a client-data system. Plausible also supports custom events, form submissions, outbound links, funnels, and user journeys. [Custom events](https://plausible.io/docs/custom-event-goals) · [Goal conversions](https://plausible.io/docs/goal-conversions)

Google Analytics 4 is another option if the team needs more advanced reports, but it is more complex and usually needs more configuration. Its Pages and screens report can show which pages people visit. [GA4 Pages and screens](https://support.google.com/analytics/answer/12926732)

For this implementation, the first version uses the Ruxin CMS as the reporting endpoint, so no third-party analytics account is required. Plausible or GA4 can still be added later if the team needs their wider reporting ecosystem.

## Main dashboard

```text
┌────────────────────────────────────────────────────────────┐
│ RUXIN WEBSITE ANALYTICS          Last 7 days  [Date range] │
├────────────────────────────────────────────────────────────┤
│ Visitors     Visits      Avg. engagement      Contact leads │
│ 1,248        1,632       52 seconds            18           │
├─────────────────────────────┬──────────────────────────────┤
│ Visitors by location         │ Top pages                    │
│ Ethiopia          42%       │ Home                    62%  │
│ China             18%       │ Services                21%  │
│ UAE                9%       │ About                   10%  │
│ Other             31%       │ Contact                  7%  │
├─────────────────────────────┴──────────────────────────────┤
│ SERVICE INTEREST                                            │
│ Investment consultancy  ████████████████████  84 clicks    │
│ Customs clearing        ████████████           49 clicks    │
│ Financial reporting     █████████              38 clicks    │
│ Recruitment             ███████                28 clicks    │
│ Legal advisory          ██████                 23 clicks    │
├────────────────────────────────────────────────────────────┤
│ TRAFFIC SOURCES       DEVICE MIX       CONTACT CONVERSION  │
│ Google / 48%           Mobile 68%       18 leads / 1.4%    │
│ Direct / 26%           Desktop 29%      Form starts: 41    │
│ LinkedIn / 14%         Tablet 3%        Form submits: 18   │
└────────────────────────────────────────────────────────────┘
```

The numbers above are examples only. They are included to show what the dashboard could look like. Do not present them as Ruxin results until real tracking data exists.

## What to measure

### 1. Visitor overview

- Unique visitors.
- Total visits.
- Page views.
- Average engagement time.
- Bounce or engagement rate, depending on the analytics tool.
- New versus returning visitors.
- Date and time trends.

### 2. Visitor location

Show approximate country, region, and city when the analytics provider supports it. Use this to answer questions such as:

- Are visitors mainly from Ethiopia, China, the UAE, or elsewhere?
- Which markets should receive more content or outreach?
- Are international visitors reaching the English pages and contact section?

Location is approximate and should be shown in aggregate. Do not try to identify individual people.

### 3. Most-read pages and sections

Track:

- Home / hero section.
- About Us.
- Services.
- Investment Intelligence.
- Why choose us.
- Our Team.
- Clients.
- Contact.

For this one-page site, section visibility should be tracked with scroll or view events. This is better than only counting the homepage because it shows what visitors actually reach. A section being viewed does not mean the visitor read every word.

### 4. Service interest

Track clicks or views for each service:

- Investment consultancy.
- Customs clearing.
- Financial reporting.
- Recruitment.
- Legal advisory.

The key report should rank services by:

1. Number of visitors who viewed the service.
2. Number of service interactions or clicks.
3. Number of contact forms started after viewing the service.
4. Number of contact forms submitted after viewing the service.

This makes “most popular service” more useful than simply counting clicks. The result should be described as “most viewed” or “most clicked,” not automatically as the service with the highest sales demand.

### 5. Traffic sources

Track where people came from:

- Google or other search engines.
- Direct visits.
- LinkedIn.
- Facebook, Instagram, and other social platforms.
- Referral websites.
- Campaign links with UTM parameters.

For marketing links, use consistent UTM values such as `utm_source`, `utm_medium`, and `utm_campaign`.

### 6. Contact conversions

Track the important actions that indicate business interest:

- Click on “Let’s Talk”.
- Click on “Talk to Ruxin”.
- Click on phone number.
- Click on email address.
- Click on website/map link.
- Contact form started.
- Contact form successfully submitted.
- Service selected in the contact form.

The main conversion should be a successful contact form submission. A phone or email click should be counted as a secondary conversion.

### 7. Device and technical experience

- Mobile, desktop, or tablet.
- Browser and operating system.
- Screen size.
- Page load performance.
- JavaScript errors.
- 404 or broken-page visits.

This helps prioritize responsive design and performance work.

## Event names for implementation

Use clear, consistent event names:

```text
section_viewed          { section: "services" }
service_viewed          { service: "investment-consultancy" }
service_interest        { service: "customs-clearing" }
cta_clicked             { label: "talk-to-ruxin", location: "hero" }
contact_form_started
contact_form_submitted  { service: "investment-consultancy" }
phone_clicked
email_clicked
map_clicked
```

These names are mainly for the developer. The client-facing report should use simpler labels such as “Service viewed,” “Contact form submitted,” and “Phone clicked.” If using Plausible, these can be implemented as custom events and goals. Its documentation also supports event properties, funnels, and visitor journeys. [Plausible Stats API](https://plausible.io/docs/stats-api)

## Reports Ruxin should review

### Weekly

- Total visitors and visits.
- Top visitor countries.
- Top pages and sections.
- Top three service interests.
- Contact form submissions.
- Phone and email clicks.

### Monthly

- Which traffic sources brought the most engaged visitors?
- Which sources produced contact leads?
- Which service is most frequently viewed?
- Which service produces the most contact actions?
- Are visitors returning more often?
- Is mobile performance improving?

## Privacy rules

- Do not collect names, email addresses, phone numbers, or message contents in analytics events.
- Track only the selected service name, not the form’s private text fields.
- Use aggregate location data, not exact personal location.
- Do not record keystrokes or session replays unless there is a clear legal and business reason.
- Add a privacy notice and cookie consent if the chosen tool requires it.
- Keep analytics separate from contact-form records.

## What needs to happen before the report works

1. Run the CMS database schema push so the analytics events table is created.
2. Start the CMS API and the website; the website sends anonymous events automatically.
3. Add campaign tags to social-media and marketing links.
4. Test the events in the CMS Analytics dashboard.
5. Connect the contact form to email delivery or a database before calling submissions leads.
6. Review the reports weekly for the first month.

## Current project status

The website now has the analytics tracker and the CMS has the anonymous event API and dashboard. The reports will remain empty until the CMS database schema is pushed and visitors use the website.

## Recommendation

Start with the small, privacy-friendly setup implemented here: visitor location, top sections, service interest, traffic source, device type, engagement, and contact actions. That is enough to learn what the website is doing without collecting client information.
