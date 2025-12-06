import { Link, useNavigate } from 'react-router-dom';
import IconText from '../ui/icon-text';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { logout } from '@/features/auth/authSlice';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import useDebounce from '@/hooks/useDebounced';
import { BookType } from '@/types/books.types';
import { Icon } from '@iconify/react';

// import cart hook
import { useCart } from '@/context/cart.context';
import { Toaster } from '../ui/sonner';
import { useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const token = useSelector((state: RootState) => state.auth.token);

  // CART CONTEXT
  const { cart } = useCart();
  const cartCount = token ? cart?.items?.length ?? 0 : 0;

  const [searchExpand, setSearchExpand] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<BookType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const debouncedSearch = useDebounce(searchText, 400);
  const qc = useQueryClient();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!debouncedSearch) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(
          `https://be-library-api-xh3x6c5iiq-et.a.run.app/api/books?q=${debouncedSearch}&page=1&limit=20`
        );

        const data = await res.json();
        setResults(data?.data?.books ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    qc.removeQueries({ queryKey: ['cart'] });
    qc.clear();
    navigate('/', { replace: true });
  };

  return (
    <header className='py-3 md:py-5 shadow-lg/25 shadow-neutral-400'>
      <Toaster richColors position='top-right' />
      <div className='custom-container flex justify-between items-center'>
        {/* Logo Part */}
        <div>
          <Link to='/'>
            <IconText>
              <IconText.Icon
                srcIcon='/assets/icons/Booky-Logo.png'
                altIcon='Booky-Logo'
                className='w-10 md:w-10.5'
              />
              <IconText.Text className='display-md-bold hidden md:block'>
                Booky
              </IconText.Text>
            </IconText>
          </Link>
        </div>

        {/* Search Section */}
        <div className='max-w-md w-full flex justify-center'>
          {/* Desktop Search */}
          <div className='hidden md:block relative w-full'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400' />
            <Input
              type='text'
              placeholder='Search book'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='rounded-full border px-9 text-sm outline-none focus:ring'
            />

            {/* Dropdown */}
            {searchText && (
              <div className='absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-xl p-2 z-50 max-h-80 overflow-y-auto'>
                {isSearching ? (
                  <p className='text-sm text-neutral-500 p-3'>Searching...</p>
                ) : results.length === 0 ? (
                  <p className='text-sm text-neutral-500 p-3'>
                    No results found
                  </p>
                ) : (
                  results.map((book) => (
                    <Link
                      to={`/books/${book.id}`}
                      key={book.id}
                      className='flex items-center gap-3 p-2 rounded hover:bg-neutral-100 transition'
                    >
                      {/* Thumbnail */}
                      <img
                        src={
                          book.coverImage ||
                          'https://placehold.co/50x70?text=No+Cover'
                        }
                        alt={book.title}
                        className='w-10 h-14 object-cover rounded'
                      />

                      <div>
                        <p className='text-sm md:text-md font-semibold'>
                          {book.title}
                        </p>
                        <p className='text-sm text-neutral-700'>
                          {book.author?.name}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <div className='md:hidden w-full flex md:justify-center justify-end px-4 md:px-2.5'>
            {searchExpand ? (
              <div className='flex items-center w-full gap-2'>
                {/* Search Input */}
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400' />
                  <Input
                    type='text'
                    autoFocus
                    placeholder='Search book'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className='w-full rounded-full border px-9 py-2 text-sm outline-none focus:ring'
                  />

                  {/* Dropdown Mobile */}
                  {searchText && (
                    <div className='absolute left-0 right-0 top-full mt-2 bg-white shadow-lg rounded-xl p-2 z-50 max-h-80 overflow-y-auto md:hidden'>
                      {isSearching ? (
                        <p className='text-sm text-neutral-500 p-3'>
                          Searching...
                        </p>
                      ) : results.length === 0 ? (
                        <p className='text-sm text-neutral-500 p-3'>
                          No results found
                        </p>
                      ) : (
                        results.map((book) => (
                          <Link
                            to={`/books/${book.id}`}
                            key={book.id}
                            className='flex items-center gap-3 p-2 rounded hover:bg-neutral-100 transition'
                            onClick={() => setSearchExpand(false)}
                          >
                            <img
                              src={
                                book.coverImage ||
                                'https://placehold.co/50x70?text=No+Cover'
                              }
                              alt={book.title}
                              className='w-10 h-14 object-cover rounded'
                            />
                            <div>
                              <p className='text-sm font-medium'>
                                {book.title}
                              </p>
                              <p className='text-xs text-neutral-500'>
                                {book.author?.name}
                              </p>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <Button variant='ghost' onClick={() => setSearchExpand(false)}>
                  <X className='size-6' />
                </Button>
              </div>
            ) : (
              <Button variant='ghost' onClick={() => setSearchExpand(true)}>
                <Search className='size-6' />
              </Button>
            )}
          </div>
        </div>

        {/* Desktop MENU */}
        <div className='items-center gap-6 flex'>
          <div className='items-center gap-6 flex justify-center'>
            {/* UPDATED: cart link + dynamic badge */}
            {token && (
              <Link
                to='/cart'
                className='relative items-center justify-center flex'
              >
                <Icon
                  icon='material-symbols:shopping-bag'
                  width={24}
                  className='text-neutral-950'
                />
                {cartCount > 0 && (
                  <span className='absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-[12px] text-white font-semibold size-4 animate-pulse'>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          <div className='hidden items-center gap-6 md:flex'>
            {user ? (
              <>
                {/* Profile Dropdown */}
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <button
                      onClick={() => setOpenProfileMenu((prev) => !prev)}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <img
                        src='/assets/images/user-avatar.png'
                        alt='avatar'
                        className='h-8 w-8 rounded-full object-cover'
                      />
                      <span className='text-sm font-semibold'>{user.name}</span>
                      <span className='text-lg'>▾</span>
                    </button>

                    {/* Dropdown */}
                    {openProfileMenu && (
                      <div className='absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border p-3 z-50'>
                        <Link
                          to='/profile'
                          className='block px-3 py-2 rounded-md text-sm md:text-md font-semibold hover:bg-neutral-50 cursor-pointer'
                        >
                          Profile
                        </Link>

                        <Link
                          to='/profile?tab=borrowed'
                          className='block px-3 py-2 rounded-md text-sm md:text-md font-semibold hover:bg-neutral-50 cursor-pointer'
                        >
                          Borrowed List
                        </Link>

                        <Link
                          to='/profile?tab=reviews'
                          className='block px-3 py-2 rounded-md text-sm md:text-md font-semibold hover:bg-neutral-50 cursor-pointer'
                        >
                          Reviews
                        </Link>

                        <button
                          onClick={handleLogout}
                          className='block w-full text-left px-3 py-2 rounded-md text-sm md:text-md font-semibold text-red-600 hover:bg-red-50 cursor-pointer'
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button asChild variant='secondary'>
                  <Link
                    to='/login'
                    className='rounded-full border px-15 py-2 text-neutral-950 text-md font-bold hover:bg-neutral-50'
                  >
                    Login
                  </Link>
                </Button>

                <Button asChild>
                  <Link
                    to='/register'
                    className='px-15 py-2 text-md font-bold text-white'
                  >
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile MENU */}
          <Sheet>
            <SheetTrigger className='md:hidden'>
              {user ? (
                <div className='flex items-center size-8'>
                  <img
                    src='/assets/images/user-avatar.png'
                    alt='avatar'
                    className='h-8 w-8 rounded-full object-cover'
                  />
                </div>
              ) : (
                <Menu className='h-6 w-6 cursor-pointer md:hidden' />
              )}
            </SheetTrigger>

            <SheetContent>
              {user ? (
                <>
                  {/* Profile */}
                  <div className='flex flex-col items-center gap-5'>
                    <div className='flex justify-end gap-4 items-end w-full flex-col'>
                      <div className='flex gap-4 items-center'>
                        <p className='text-md font-bold'>{user.name}</p>
                        <img
                          src='/assets/images/user-avatar.png'
                          alt='avatar'
                          className='h-8 w-8 rounded-full object-cover'
                        />
                      </div>
                      <Link
                        to='/profile'
                        className='w-full block px-3 py-2 rounded-md text-sm md:text-md font-semibold hover:bg-neutral-50 cursor-pointer'
                      >
                        Profile
                      </Link>

                      <Link
                        to='/borrowed'
                        className='w-full block px-3 py-2 rounded-md text-sm md:text-md font-semibold hover:bg-neutral-50 cursor-pointer'
                      >
                        Borrowed List
                      </Link>

                      <Link
                        to='/reviews'
                        className='w-full block px-3 py-2 rounded-md text-sm md:text-md font-semibold hover:bg-neutral-50 cursor-pointer'
                      >
                        Reviews
                      </Link>
                    </div>
                    <div className='w-full group'>
                      <SheetClose asChild>
                        <Button
                          variant='secondary'
                          onClick={handleLogout}
                          className='rounded-full border px-15 py-2 text-red-600 text-md font-bold hover:bg-neutral-50 w-full'
                        >
                          Logout
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    className='rounded-full border px-5 py-2 text-sm hover:bg-neutral-100'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='rounded-full bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700'
                  >
                    Register
                  </Link>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
