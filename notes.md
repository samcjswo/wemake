# Dev Concepts Notes

---

## For Product Managers — What You Need to Know

### 1. This project uses Remix
The tech stack choice is already made. Remix is good for web apps with lots of user interaction, loads pages fast, and isn't locked into one hosting provider.

### 2. Page rendering affects SEO and user experience
When planning a new page, ask yourself:
> **"Can a logged-out user find this on Google?"**

| If yes → use SSR | If no → CSR is fine |
|---|---|
| Landing pages | User dashboards |
| Product pages | Admin panels |
| Blog posts | Settings pages |
| Public listings | Chat / notifications |

This decision affects **Google ranking, page speed, and hosting cost** — worth flagging to your dev team early when scoping new features.

### 3. Cache = speed, Cookie = memory
- **Cache** — makes your site faster for returning users. If users complain "the old content is still showing," that's a cache issue.
- **Cookie** — how the site remembers who's logged in and their preferences. If users get logged out unexpectedly, that's a cookie issue.

### 4. First impressions matter (First Load)
- Public pages (SSR) load fast for first-time visitors — good for conversion
- Logged-in pages (CSR) may have a brief loading moment — acceptable since users are already committed

---

## SSR (Server-Side Rendering)
The page HTML is generated on the **server** before being sent to the browser, rather than built in the browser via JavaScript.

---

## Remix vs Next.js

Both are React frameworks, but with different philosophies.

### Next.js
Like ordering from a big restaurant menu — lots of options, very popular, huge community.

**Pros:**
- Most popular React framework — easiest to find help, tutorials, and developers
- Very flexible — works well for blogs, e-commerce, dashboards, anything
- Backed by Vercel, well-funded and actively developed
- Huge job market demand

**Cons:**
- So many options it can be overwhelming (which rendering mode do I pick?)
- Can feel bloated for simple projects
- Some features only work best when hosted on Vercel

### Remix
Like a smaller specialty restaurant that focuses on doing a few things really well.

**Pros:**
- Simpler mental model — data loading and page rendering are tightly connected and predictable
- Faster page loads by default because it loads data smarter
- Works great on many hosting platforms, not tied to one provider
- Forms and navigation feel very natural

**Cons:**
- Smaller community — fewer tutorials and Stack Overflow answers
- Less flexible for things like static sites or blogs
- Smaller job market compared to Next.js

### Summary Table

| | Next.js | Remix |
|---|---|---|
| Popularity | Very high | Growing |
| Learning resources | Abundant | Limited |
| Best for | General purpose | Web apps with lots of user interaction |
| Flexibility | High | Medium |

**This project uses Remix (React Router v7).**

- If you're **learning** → Next.js (more resources)
- If you're **building a web app** → either works, Remix has elegant patterns

---

## CSR (Client-Side Rendering)
The opposite of SSR. The browser downloads a mostly empty HTML file + JavaScript, then builds the page itself.

- **SSR** = restaurant that serves you a fully cooked meal
- **CSR** = restaurant that gives you raw ingredients and you cook it yourself at the table

---

## SSR vs CSR

| | SSR | CSR |
|---|---|---|
| Where page is built | Server | Browser |
| First load speed | Fast | Slow |
| After first load | Normal | Very fast |
| SEO | Great | Poor |
| Hosting cost | Higher | Cheaper |
| Best for | Public sites, e-commerce, blogs | Dashboards, tools, internal apps |

### SSR Pros
- Fast first page load — user sees content immediately
- Great SEO — search engines can read the full page
- Works even with slow devices (server does the heavy lifting)
- Secure — sensitive logic stays on the server

### SSR Cons
- Every page request hits the server — higher cost
- Slower page transitions compared to CSR
- More complex to host and scale

### CSR Pros
- Very fast after initial load — feels like a native app
- Cheap and simple to host (just static files on a CDN)
- Great for highly interactive UIs

### CSR Cons
- Slow first load — browser downloads and runs JS before showing anything
- Poor SEO — search engines may not index content properly
- Bad experience on slow devices or connections
- Sensitive logic is exposed in the browser

---

## What is "First Load"?
The moment a user first visits your site — before anything is cached or downloaded.

- **SSR** → server builds the HTML and sends it ready-to-display → user sees the page almost immediately
- **CSR** → browser gets an empty HTML shell, downloads JavaScript, runs it, fetches data, *then* shows the page → user sees a blank/loading screen for a moment

After first load, CSR becomes very fast because JavaScript is already cached and page transitions don't need the server.

**Real world examples:**
- Open Facebook for the first time → brief loading spinner → CSR
- Open a news article via Google → content appears immediately → SSR

**The tradeoff:**
- **SSR** = great first impression, every page transition needs the server
- **CSR** = slightly rough first impression, but very smooth after that

---

## Which Rendering Does Each Framework Use?

### Remix
- **SSR by default** — every page rendered on server per request
- Good SEO out of the box
- Can use CSR for specific interactive parts via React state
- Not ideal for static sites (SSG)

### Next.js
Supports all strategies — you choose per page:
- **SSR** → `getServerSideProps`
- **CSR** → React hooks like `useEffect`
- **SSG** → `getStaticProps`
- **ISR** → `getStaticProps` + `revalidate`
- **RSC** → React Server Components (newer App Router approach)

---

## Cache

Temporary storage that saves copies of data so it doesn't have to be fetched again.

**Analogy:** You read a recipe once and write it on a sticky note. Next time you cook, you read the sticky note instead of finding the book again — faster.

**Examples:**
- Browser caches images/JS files so pages load faster on repeat visits
- Server caches database results so it doesn't query the DB every time

---

## Cookie

A small piece of data the server saves in your browser to remember you.

**Analogy:** A coat check ticket — the venue gives you a number, and next time you visit, you show the ticket and they know who you are.

**Examples:**
- Staying logged in after closing the browser
- Remembering your language/theme preference
- Tracking items in a shopping cart

---

## Cache vs Cookie

| | Cache | Cookie |
|---|---|---|
| Purpose | Speed up loading | Remember user info |
| Stored by | Browser or server | Browser |
| Contains | Files, images, data | Small text (user ID, session, preferences) |
| Expires | Automatically | Set expiry date or manual |
| Set by | Browser automatically | Server or JavaScript |

- **Cache** = saves stuff to go faster
- **Cookie** = saves stuff to remember you

---

## When to Use SSR vs CSR

### Use SSR when:
- The page needs to be **found on Google** (SEO matters)
- Content is **public** — blogs, landing pages, product pages, news
- You want **fast first load** for new visitors
- The data changes per request (user-specific but needs to be secure)

### Use CSR when:
- The page is **behind a login** (SEO doesn't matter)
- It's a **dashboard, admin panel, or tool**
- The data is **user-specific** and updates frequently
- You want **instant page transitions** after login

### Real world examples

| Page | Rendering | Why |
|---|---|---|
| Homepage | SSR | Public, needs SEO |
| Product listing | SSR | Needs SEO |
| Blog post | SSR | Public, needs SEO |
| User dashboard | CSR | Behind login, no SEO needed |
| Admin panel | CSR | Private, highly interactive |
| Chat / notifications | CSR | Real-time, user-specific |

### Simple rule of thumb
> **Can a logged-out stranger find this page on Google?**
> - Yes → SSR
> - No → CSR is fine

### In Remix
- **`loader`** = SSR (runs on server)
- **`clientLoader`** = CSR (runs in browser)

---

## HTTP Methods: GET vs POST

### GET
- **Purpose**: Retrieve data
- **Data location**: URL query string (`/search?q=hello`)
- **Visible**: Yes — parameters are in the URL
- **Cached**: Yes — browsers and CDNs can cache it
- **Idempotent**: Yes — calling it multiple times has no side effect
- **Examples**: loading a page, searching, filtering, pagination

### POST
- **Purpose**: Send data to create/change something
- **Data location**: Request body (not visible in URL)
- **Visible**: No — body is hidden from the URL bar
- **Cached**: No
- **Idempotent**: No — submitting twice creates two records
- **Examples**: sign up, sign in, creating a post, placing an order

### The other methods (REST)

| Method | Purpose | Example |
|---|---|---|
| `GET` | Read | `GET /posts/1` |
| `POST` | Create | `POST /posts` |
| `PUT` | Replace entirely | `PUT /posts/1` (full update) |
| `PATCH` | Partial update | `PATCH /posts/1` (change one field) |
| `DELETE` | Delete | `DELETE /posts/1` |

### Key rule of thumb
> **GET** = safe, no side effects. You can bookmark it, share the URL, hit refresh.
>
> **POST/PUT/PATCH/DELETE** = causes a change. Refreshing re-submits — that's why browsers warn "are you sure you want to resubmit this form?"

HTML forms natively only support `GET` and `POST`. Frameworks like React Router or Rails fake `PUT`/`PATCH`/`DELETE` by sending a hidden `_method` field inside a POST body.

### In React Router v7 (this project)

| HTTP | Maps to | Used for |
|---|---|---|
| GET | `loader` | Fetching data to render a page |
| POST | `action` | Form submissions — sign in, create, update, delete |

Logout uses a **loader** (GET) because it's triggered by a `<Link>` navigation, not a form.
