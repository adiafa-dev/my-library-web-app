import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import BookDetailPage from './pages/books/BookDetailPage';
import CategoryPage from './pages/categories/CategoryPage';
import AuthorPage from './pages/authors/AuthorPage';
import ProfilePage from './pages/profile/ProfilePage';
import CartPage from './pages/cart/CartPage';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/books/:id' element={<BookDetailPage />} />
      <Route path='/categories' element={<CategoryPage />} />
      <Route path='/category' element={<CategoryPage />} />
      <Route path='/authors/:id/books' element={<AuthorPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/cart' element={<CartPage />} />
      </Route>

      {/* Default */}
      <Route path='*' element={<Home />} />
    </Routes>
  );
}
