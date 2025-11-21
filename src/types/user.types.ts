export type MeResponse = {
  profile: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
  loanStats: {
    borrowed: number;
    late: number;
    returned: number;
    total: number;
  };
  reviewsCount: number;
};
