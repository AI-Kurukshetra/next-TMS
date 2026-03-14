export type Driver = {
  id: string;
  carrier_id: string;
  user_id: string | null;
  full_name: string;
  phone: string | null;
  license_number: string | null;
  is_active: boolean;
  created_at: string;
};
