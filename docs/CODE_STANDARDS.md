# Skoolway code standards

High-level goal: **maximum use of components**, **small files**, and **easy-to-scan code** so every file stays easy to read and change.

---

## 1. Line count (per file)

Research and common practice:

- **ESLint** `max-lines`: default **300**; recommendations usually **100–500**.
- **React / React Native**: many teams aim for **~100–150 lines per component**, with **200–300** as a hard cap for a single file.
- **Practical threshold**: components over **~200 lines** are usually harder to read, test, and maintain.

**Skoolway standard:**

| Type | Max lines (enforced) | Target (aim for) |
|------|----------------------|------------------|
| **Any file** | **200** | &lt; 150 |
| **React component file** | **200** | **&lt; 100** |

- Count uses **code only** (blank lines and comment-only lines are ignored by the linter).
- If a file approaches the limit, **split by responsibility**: extract subcomponents, hooks, or utils.

---

## 2. Functions

- **max-lines-per-function**: **50** (enforced).
- Prefer small, single-purpose functions. Extract logic into helpers or hooks when a function grows.

---

## 3. Components: use them to the max

- **One main component per file** (plus small, file-private subcomponents if they’re not reused).
- **Extract early**: if a section of JSX or logic is reusable or makes the parent hard to read, put it in its own component (in the same file first, then in `src/components/` when shared).
- **Single responsibility**: each component should do one clear thing (e.g. a header, a form, a list row).
- **Naming**: components and files should reflect that single role (e.g. `LoginForm.js`, `CourseCard.js`).

---

## 4. Where to put code

| Kind of code | Location |
|--------------|----------|
| Shared UI building blocks | `src/components/` |
| Full-screen views | `src/screens/` |
| App shell, layout, root | `src/app/` |
| Reusable logic / state | `src/hooks/` |
| Pure helpers, formatters, validators | `src/utils/` |
| Constants, config | `src/constants/` |
| Theme (colors, typography, spacing) | `src/theme/` |
| Platform-specific implementation | `*.web.js` / `*.ios.js` / `*.android.js` |

---

## 5. Resulting structure (easy to access and optimised)

- **Small files** → quick to open and understand.
- **Many components** → clear boundaries and reuse.
- **Consistent places** for screens, components, hooks, utils → predictable navigation and imports.
- **Linter** enforces file and function length so the codebase stays within these limits.

This gives you a **fully easy-to-access and optimised** structure for React Native (mobile + web) with component-first, high-quality file size standards.
