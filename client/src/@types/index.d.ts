export interface RootState {
  auth: {
    accessToken: string | null;
    user: {
      _id: string;
      name: string;
      email: string;
      avatar: {
        public_id: string;
        url: string;
      };
      role: string;
      isActive: string;
    } | null;
  };
}

interface Transaction {
  _id: string;
  category: string;
  icon: string;
  date: string;
  amount: number;
  source: string;
}
