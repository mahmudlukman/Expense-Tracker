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