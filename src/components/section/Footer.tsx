import { Link } from 'react-router-dom';
import IconText from '../ui/icon-text';
import { socialMediaData } from '@/constants/social-data';

const Footer = () => {
  return (
    <section className='w-full md:py-20 py-10 border-t border-t-neutral-300'>
      <div className='custom-container flex flex-col justify-center items-center'>
        <Link to='/'>
          <IconText>
            <IconText.Icon
              srcIcon='/assets/icons/Booky-Logo.png'
              altIcon='Booky-Logo'
              className='w-10 md:w-10.5'
            />
            <IconText.Text className='display-md-bold'>Booky</IconText.Text>
          </IconText>
        </Link>

        <p className='py-4 md:py-5.5 text-sm md:text-md font-semibold text-neutral-950'>
          Discover inspiring stories & timeless knowledge, ready to borrow
          anytime. Explore online or visit our nearest library branch.
        </p>

        <h4 className='md:text-md font-bold py-4 md:py-5'>
          Follow on Social Media
        </h4>

        <div className='flex gap-4'>
          {socialMediaData.map((icon) => (
            <Link
              key={icon.alt}
              to={icon.href}
              className='flex justify-center items-center size-10 rounded-full border border-neutral-300 text-neutral-950 hover:border-primary-300 group p-2.5'
            >
              {icon.icon}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Footer;
