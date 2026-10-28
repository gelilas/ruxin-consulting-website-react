# Ruxin Website Analytics Brief

## Goal

Measure how people use the Ruxin website so the team can understand:

- Where visitors come from.
- Which pages and sections they read.
- Which services receive the most interest.
- Which actions lead people to contact Ruxin.
- Which devices and locations need the best experience.

This is website analytics only. It is not a client-registration system, CRM, or investor portal.

## Recommended tool

Use a privacy-focused analytics tool such as Plausible for the first version. It can report pages, countries, cities, referrers, devices, and custom goals without turning the public website into a client-data system. Plausible also supports custom events, form submissions, outbound links, funnels, and user journeys. [Custom events](https://plausible.io/docs/custom-event-goals) · [Goal conversions](https://plausible.io/docs/goal-conversions)

Google Analytics 4 is another option if the team needs more advanced reports, but it is more complex. Its Pages and screens report can show which pages people visit. [GA4 Pages and screens](https://support.google.com/analytics/answer/12926732)

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

The numbers above are examples only. Do not publish them until real tracking data exists.

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

For this one-page site, section visibility should be tracked with scroll or view events. This is better than only counting the homepage because it shows what visitors actually reach.

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

This makes “most popular service” more useful than simply counting clicks.

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

If using Plausible, these can be implemented as custom events and goals. Its documentation also supports event properties, funnels, and visitor journeys. [Plausible Stats API](https://plausible.io/docs/stats-api)

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

## Simple implementation plan

1. Choose Plausible or GA4 and create the Ruxin website property.
2. Add the tracking script through the app’s main HTML entry point.
3. Add section IDs and service event names.
4. Track contact, phone, email, and map actions.
5. Add UTM tags to social and campaign links.
6. Test events in the analytics dashboard.
7. Review the reports weekly for the first month.

## Recommendation

Start with a small, privacy-friendly setup: visitor location, top sections, service interest, traffic source, device type, and contact conversions. That is enough to learn what the website is doing without building an unnecessary dashboard or collecting client information.
