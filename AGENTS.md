## Tech Stack

| Category                | Technology                                       | Purpose                                                 |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| **Framework**           | Next.js (App Router), TypeScript                 | Server-side rendering, routing, and type safety         |
| **Styling & UI**        | Tailwind CSS, shadcn/ui                          | Responsive, accessible, and modern UI development       |
| **State Management**    | TanStack Query + Zustand / Context _(if needed)_ | Server-state caching and global client-state management |
| **Forms & Validation**  | React Hook Form / `@tanstack/react-form` + Zod   | Type-safe form handling and client-side validation      |
| **Authentication**      | NextAuth.js + Middleware                         | Secure session management and protected routes          |
| **Payment Integration** | Bkash sandbox (Test Mode)                        | Real payment processing with success/cancel flows       |
| **Data Visualization**  | Recharts / Chart.js                              | Admin dashboard charts and analytics                    |
| **Media & Icons**       | `next/image`, Lucide React                       | Optimized image delivery and consistent iconography     |
| **Notifications**       | Sonner                                           | User-friendly toast notifications                       |
| **Deployment**          | Vercel                                           | Production frontend deployment with edge network        |

---

### 🔐 Mandatory UI Requirement: One-Click Demo Login

The login page must feature a clear, structured layout with separate, easily accessible **Demo Login** buttons for each of the 3 roles. This allows evaluators to quickly test role-based UI without manually typing credentials.

```text
┌─────────────────────────────────────────────┐
│                                             │
│              Welcome Back 👋                │
│                                             │
│        Login to your account                │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Email                                 │  │
│  │ [_______________________________]     │  │
│  │                                       │  │
│  │ Password                              │  │
│  │ [_______________________________]     │  │
│  │                                       │  │
│  │          [ 🔐 Login ]                 │  │
│  └───────────────────────────────────────┘  │
│                                             │
│              ─── OR ───                     │
│                                             │
│           🚀 Quick Demo Login               │
│                                             │
│  ┌──────────────┐ ┌──────────────┐          │
│  │ 👨‍💼 Admin     │ │ 👤 User      │          │
│  │              │ │              │          │
│  │ [Demo Login] │ │ [Demo Login] │          │
│  └──────────────┘ └──────────────┘          │
│                                             │
│          ┌──────────────────┐               │
│          │ 🛠️ Provider      │               │
│          │                  │               │
│          │  [Demo Login]    │               │
│          └──────────────────┘               │
│                                             │
└─────────────────────────────────────────────┘
```

_Note: Each **Demo Login** button should automatically authenticate the user with the corresponding demo account and redirect them to the appropriate role-specific dashboard._
