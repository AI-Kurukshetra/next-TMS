import { UserRole } from "@/types/user";

export const USER_ROLE_OPTIONS: Array<{
  value: UserRole;
  label: string;
  description: string;
}> = [
  {
    value: "customer",
    label: "Customer",
    description: "Book shipments and follow their delivery progress.",
  },
  {
    value: "dispatcher",
    label: "Dispatcher",
    description: "Coordinate shipments, assignments, and network operations.",
  },
  {
    value: "driver",
    label: "Driver",
    description: "Update active loads and record delivery milestones.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage all operational data and user access.",
  },
];

export const APP_NAV_ITEMS: Array<{
  href: string;
  label: string;
  roles: UserRole[];
}> = [
  {
    href: "/dashboard",
    label: "Dashboard",
    roles: ["admin", "dispatcher", "customer", "driver"],
  },
  {
    href: "/shipments",
    label: "Shipments",
    roles: ["admin", "dispatcher", "customer", "driver"],
  },
  {
    href: "/tracking",
    label: "Tracking",
    roles: ["admin", "dispatcher", "customer", "driver"],
  },
  {
    href: "/customers",
    label: "Customers",
    roles: ["admin", "dispatcher"],
  },
  {
    href: "/carriers",
    label: "Carriers",
    roles: ["admin", "dispatcher"],
  },
  {
    href: "/drivers",
    label: "Drivers",
    roles: ["admin", "dispatcher"],
  },
  {
    href: "/vehicles",
    label: "Vehicles",
    roles: ["admin", "dispatcher"],
  },
  {
    href: "/routes",
    label: "Routes",
    roles: ["admin", "dispatcher"],
  },
  {
    href: "/rates",
    label: "Rates",
    roles: ["admin", "dispatcher"],
  },
  {
    href: "/users",
    label: "Users",
    roles: ["admin"],
  },
];

const PATH_ROLE_RULES: Array<{
  matches: (pathname: string) => boolean;
  roles: UserRole[];
}> = [
  {
    matches: (pathname) => pathname === "/dashboard",
    roles: ["admin", "dispatcher", "customer", "driver"],
  },
  {
    matches: (pathname) =>
      pathname === "/shipments" || pathname.startsWith("/shipments/"),
    roles: ["admin", "dispatcher", "customer", "driver"],
  },
  {
    matches: (pathname) => pathname === "/tracking",
    roles: ["admin", "dispatcher", "customer", "driver"],
  },
  {
    matches: (pathname) => pathname === "/customers",
    roles: ["admin", "dispatcher"],
  },
  {
    matches: (pathname) => pathname === "/carriers",
    roles: ["admin", "dispatcher"],
  },
  {
    matches: (pathname) => pathname === "/drivers",
    roles: ["admin", "dispatcher"],
  },
  {
    matches: (pathname) => pathname === "/vehicles",
    roles: ["admin", "dispatcher"],
  },
  {
    matches: (pathname) => pathname === "/routes",
    roles: ["admin", "dispatcher"],
  },
  {
    matches: (pathname) => pathname === "/rates",
    roles: ["admin", "dispatcher"],
  },
  {
    matches: (pathname) => pathname === "/users",
    roles: ["admin"],
  },
];

export function isUserRole(value: string): value is UserRole {
  return USER_ROLE_OPTIONS.some((option) => option.value === value);
}

export function getRoleLabel(role: UserRole) {
  return USER_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}

export function getDefaultRouteForRole(_role: UserRole) {
  return "/dashboard";
}

export function canAccessPath(role: UserRole, pathname: string) {
  const rule = PATH_ROLE_RULES.find(({ matches }) => matches(pathname));
  return rule ? rule.roles.includes(role) : true;
}

export function canCreateShipment(role: UserRole) {
  return ["admin", "dispatcher", "customer"].includes(role);
}

export function canCreateCarrier(role: UserRole) {
  return role === "admin";
}

export function canManageUsers(role: UserRole) {
  return role === "admin";
}

export function canCreateDriver(role: UserRole) {
  return ["admin", "dispatcher"].includes(role);
}

export function canAssignShipment(role: UserRole) {
  return ["admin", "dispatcher"].includes(role);
}

export function canUpdateShipmentStatus(role: UserRole) {
  return ["admin", "dispatcher", "driver"].includes(role);
}

export function canAddTrackingEvent(role: UserRole) {
  return ["admin", "dispatcher", "driver"].includes(role);
}
