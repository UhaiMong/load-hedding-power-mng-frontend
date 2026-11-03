export const companyName = "PBD Power Management Ltd.";
export const contactNo = "+8801711111111";
export const contactStr = "+880 1711-111111";
export const email = "help@pbdpower.com";
export const address = "House 123, Road 45, Block A, Dhaka, Bangladesh";
export const fb_link = "https://www.facebook.com/pbdpower";
export const insta_link = "https://www.instagram.com/pbdpower";
export const mapStr = "https://maps.google.com/?q=PBD+Power+Management+Ltd.";
export const tiktok_link = "https://www.tiktok.com/@pbdpower";

export const govRegistrationNo = "123456789";

export const API_URL = (process.env.API_URL ?? "http://localhost:5000").replace(
  /\/$/,
  "",
);

// Cookies set by the proxy route (httpOnly except the session flag)
export const TOKEN_COOKIE = "ls_token";
export const ROLE_COOKIE = "ls_role";
export const SESSION_COOKIE = "ls_session"; // readable flag so the client knows whether to call /users/me
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // matches the backend session lifetime (7 days)

export const ROLES = [
  "CUSTOMER",
  "OPERATOR",
  "TECHNICIAN",
  "ZONE_MANAGER",
  "ADMIN",
] as const;
export type Role = (typeof ROLES)[number];

/** Where each role lands after login (create a page for each of these). */
export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin/superadmin",
  ZONE_MANAGER: "/admin/manager",
  OPERATOR: "/admin/operator",
  TECHNICIAN: "/admin/technician",
  CUSTOMER: "/admin/customer",
};

export const homeFor = (role: Role) => ROLE_HOME[role];

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  ZONE_MANAGER: "Zone Manager",
  OPERATOR: "Operator",
  TECHNICIAN: "Technician",
  CUSTOMER: "Customer",
};

// Seed accounts from the backend (one-click demo login)
export const DEMO_PASSWORD = "Admin@885";
export const DEMO_ACCOUNTS: { role: Role; email: string; emoji: string }[] = [
  { role: "ADMIN", email: "admin@loadsheddin.com", emoji: "" },
  { role: "ZONE_MANAGER", email: "manager@loadsheddin.com", emoji: "" },
  { role: "OPERATOR", email: "operator@loadsheddin.com", emoji: "" },
  { role: "TECHNICIAN", email: "tech1@example.com", emoji: "" },
  { role: "CUSTOMER", email: "uhaimong.dev@gmail.com", emoji: "" },
];
