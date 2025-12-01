import { useQuery } from '@tanstack/react-query';
import axios from '@/api/axiosInstance';
import { Loan, LoanResponse } from '@/types/loan.types';

const BorrowedList = () => {
  const loanQuery = useQuery<LoanResponse>({
    queryKey: ['my-loans'],
    queryFn: async () => {
      const res = await axios.get('/api/loans/my');
      return res.data as LoanResponse;
    },
  });

  if (loanQuery.isLoading) return <p>Loading...</p>;
  if (!loanQuery.data) return <p>No data</p>;

  const loans = loanQuery.data.data.loans;

  return (
    <div>
      <h1>Borrowed List</h1>

      {loans.map((loan: Loan) => (
        <div key={loan.id} className='border p-4 my-3 rounded'>
          <p>Status: {loan.status}</p>
          <img src={loan.Book.coverImage || ''} className='w-20' />
          <p>{loan.Book.title}</p>
          <p>Borrowed: {new Date(loan.borrowedAt).toLocaleString()}</p>
          <p>Due: {new Date(loan.dueAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default BorrowedList;
