export type BorrowedBook = {
  id: number;
  title: string;
  coverImage: string | null;
};

export type Loan = {
  id: number;
  userId: number;
  bookId: number;
  status: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  Book: BorrowedBook;
};

export type LoanResponse = {
  success: boolean;
  message: string;
  data: {
    loans: Loan[];
  };
};
