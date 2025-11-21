export type Book = {
  id: number;
  title: string;
  coverImage: string | null;
  rating: number;
  author: { name: string };
};

export type Author = {
  id: number;
  name: string;
  bio: string;
};

export type BookType = {
  id: number;
  title: string;
  authorId: number;
  author: {
    id: number;
    name: string;
  };
  // optional fields untuk tailwind card nanti:
  coverImage: string | null;
  rating: number;
};

export type ReviewUser = {
  id: number;
  name: string;
};

export type Review = {
  id: number;
  star: number;
  comment: string;
  userId: number;
  bookId: number;
  createdAt: string;
  user: ReviewUser;
};

export type ReviewResponse = {
  bookId: number;
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type BookDetailType = {
  id: number;
  title: string;
  description: string;
  coverImage: string | null;
  publishedYear: number;
  totalCopies: number;
  rating: number;
  reviewCount: number;

  author: {
    id: number;
    name: string;
  };

  category: {
    id: number;
    name: string;
  };

  reviews?: Review[]; // optional karena detail buku belum tentu include reviews
};

export type Category = {
  id: number;
  name: string;
};

export type AuthorDetail = {
  id: number;
  name: string;
  bio: string;
  books: Book[];
};
