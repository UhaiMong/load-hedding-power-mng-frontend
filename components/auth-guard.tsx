"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role } from "@/lib/constants";
import { homeFor } from "@/lib/constants";
import { canAccess } from "@/lib/routes";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Loading } from "@/components/common/states";

/** Client-side gate for dashboards: needs a loaded user allowed on this path (or one of `roles`). */
