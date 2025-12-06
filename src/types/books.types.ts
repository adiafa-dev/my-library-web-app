export type Book = {
  id: number;
  title: string;
  coverImage: string | null;
  rating: number;
  Author: { name: string };
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
  author?: {
    id: number;
    name: string;
  } | null;
  // optional fields untuk tailwind card nanti:
  coverImage?: string | null;
  rating?: number;
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
  User?: ReviewUser | null;
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
  categoryId: number;
  availableCopies: number;
  stock: number;

  Author?: {
    id: number;
    name: string;
    bio?: string | null;
  } | null;

  Category?: {
    id: number;
    name: string;
  } | null;

  Review?: Review[] | null; // optional karena detail buku belum tentu include reviews
};

export type Category = {
  id: number;
  name: string;
};

export type AuthorDetail = {
  id: number;
  name: string;
  bio?: string | null;
  books: Book[] | null;
};
