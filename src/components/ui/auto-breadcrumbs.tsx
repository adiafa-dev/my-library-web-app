import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { breadcrumbLabels } from '@/constants/breadcrumbs-label';

type AutoBreadcrumbsProps = {
  lastLabel?: string; // dynamic label (misal title)
};

const AutoBreadcrumbs = ({ lastLabel }: AutoBreadcrumbsProps) => {
  const location = useLocation();

  const pathSegments = location.pathname
    .split('/')
    .filter((segment) => segment !== '');

  const lastIndex = pathSegments.length - 1;

  const buildPath = (index: number) =>
    '/' + pathSegments.slice(0, index + 1).join('/');

  return (
    <nav className='flex items-center text-sm text-neutral-950 gap-1 py-4 font-semibold'>
      {/* HOME */}
      <Link to='/' className='hover:underline text-primary-300 font-semibold'>
        Home
      </Link>

      {pathSegments.map((segment, index) => {
        const isLast = index === lastIndex;

        // label default dari mapping
        let label =
          breadcrumbLabels[segment] ||
          segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

        // override SEGMENT TERAKHIR dengan TITLE buku
        if (isLast && lastLabel) {
          label = lastLabel;
        }

        return (
          <div key={index} className='flex items-center gap-1'>
            <ChevronRight className='w-4 h-4 text-neutral-950' />

            {isLast ? (
              <span className='text-neutral-900 font-semibold'>{label}</span>
            ) : (
              <Link
                to={buildPath(index)}
                className='hover:underline text-primary-300 font-semibold'
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default AutoBreadcrumbs;
