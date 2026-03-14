export type UserRole =
  | "admin"
  | "dispatcher"
  | "customer"
  | "driver";

export type AppUser = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  carrier_id: string | null;
  customer_id: string | null;
  created_at: string;
};
