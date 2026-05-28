# AquaPay — Water Billing System

A modern, responsive static website for managing and paying water bills. AquaPay offers a polished front-end experience with dark/light themes, animated UI, client-side form validation, and a simulated secure payment flow.

## Features

- **Multi-page site** — Home, About, Payment, and Contact pages with shared navigation and footer
- **Dark / light theme** — Toggle with preference saved in `localStorage`
- **Responsive layout** — Mobile hamburger menu, sticky navigation, back-to-top button
- **Scroll animations** — Reveal effects and animated stat counters on the home page
- **Payment portal** — Live card preview, Visa/Mastercard/Amex detection, amount summary with fee
- **Form validation** — Payment and contact forms with inline error messages
- **Simulated checkout** — Demo payment processing with success overlay and reference ID
- **Hero effects** — Floating particles on hero sections

## Pages

| File | Description |
|------|-------------|
| `index.html` | Landing page — hero, features, testimonials, CTA |
| `about.html` | Company story, values, team |
| `payment.html` | Bill payment form with card UI |
| `contact.html` | Contact form and support details |

## Project structure

```
water/
├── index.html      # Home
├── about.html      # About
├── payment.html    # Payment
├── contact.html    # Contact
├── style.css       # Global styles and themes
├── script.js       # UI logic, forms, animations
└── README.md       # This file
```

## How to run

No build step or dependencies are required. Use any of the following:

### Option 1 — Open directly

Double-click `index.html` or open it in your browser (Chrome, Edge, Firefox, etc.).

### Option 2 — Local server (recommended)

Some features work best when served over HTTP (e.g. active nav paths). From the project folder:

**Python 3**

```bash
python -m http.server 8000
```

**Node.js (npx)**

```bash
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000) (or the port shown in the terminal).

### Option 3 — VS Code / Cursor Live Server

Install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

## Tech stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, flexbox, grid) |
| Scripting | Vanilla JavaScript (ES6+) |
| Icons | [Font Awesome 6.5](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css) (CDN) |

## JavaScript overview (`script.js`)

| Module | Behavior |
|--------|----------|
| Loader | Hides splash screen after page load |
| Navigation | Sticky nav, active link highlighting, mobile menu |
| Theme | Dark/light toggle persisted as `aquapay-theme` |
| Scroll reveal | `IntersectionObserver` for `.reveal` elements |
| Counters | Animated numbers via `[data-target]` attributes |
| Payment | Card formatting, network icons, validation, demo submit |
| Contact | Name, email, message validation and success toast |

> **Note:** Payments and contact submissions are **front-end demos only**. No data is sent to a server. For production, connect forms to a backend or payment gateway (e.g. M-Pesa, Stripe).

## Browser support

Works in current versions of Chrome, Edge, Firefox, and Safari. Requires JavaScript enabled.

## Deployment

Upload all project files to any static host, for example:

- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

Ensure `index.html` is at the site root.

## License

This project is provided for educational and portfolio use. Add your preferred license (e.g. MIT) if you publish it publicly.

## Author

**Your Name** — update this section with your name, email, or GitHub profile.

---

Built with care for simple, accessible water bill management.
