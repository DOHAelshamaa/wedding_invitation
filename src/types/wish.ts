export interface Wish {
  id: string;
  wedding_id: string;
  guest_name: string;
  message: string;
  approved: boolean;
  created_at: string;
}

export interface NewWish {
  wedding_id: string;
  guest_name: string;
  message: string;
}
