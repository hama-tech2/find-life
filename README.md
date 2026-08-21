# Find Your Life — Frontend Prototype

This repository contains the current plain HTML, CSS, and JavaScript frontend prototype.

## Run locally

From the repository folder, start a small local web server:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

On Windows, if `python` is unavailable but the Python launcher is installed, use:

```powershell
py -m http.server 8080
```

No package installation or build step is required.

## Main prototype pages

- Landing: `index.html`
- Authentication: `auth.html`
- Onboarding: `onboarding.html`
- Discover and filters: `discover.html`
- Introduction detail: `detail.html`
- Structured request: `request.html`
- Requests and request detail: `requests.html`, `request-detail.html`
- Guided exchange and conversation: `guided.html`, `conversation.html`
- Face reveal and contact exchange: `face-reveal.html`, `contact-exchange.html`
- My introduction and create/edit: `my-introduction.html`, `create-introduction.html`
- Profile, settings, and account status: `profile.html`, `settings.html`, `account-status.html`
- Report: `report.html`

`trusted-person.html` and `trusted-person.js` are retained as legacy prototype files and are not linked from the active frontend.
