import { categoryCTAData } from '@/constants/category-data';
import { Card, CardContent } from '../ui/card';
import { Link } from 'react-router-dom';

const CategoryCTA = () => {
  return (
    <section className='w-full md:pt-12 pt-6'>
      <div className='custom-container grid grid-cols-3 md:grid-cols-6 gap-6'>
        {categoryCTAData.map((icon) => (
          <Link to={icon.href} key={icon.label}>
            <Card className='rounded-lg p-3 flex flex-col items-start gap-4 shadow-md shadow-neutral-400/25 border-neutral-100 border transition'>
              <div className='bg-primary-200 w-full flex justify-center rounded-lg'>
                <img
                  src={icon.iconSrc}
                  alt={icon.label}
                  className='w-15 h-15 md:w-20 md:h-20 rounded-full object-cover'
                />
              </div>

              <CardContent className='p-0'>
                <span className='text-xs md:text-md font-semibold text-neutral-950'>
                  {icon.label}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryCTA;
