import { Icon } from '@iconify/react';
import { ReactNode } from 'react';

type IconSocial = {
  href: string;
  icon: ReactNode;
  alt: string;
};

export const socialMediaData: IconSocial[] = [
  {
    href: '#',
    icon: (
      <Icon
        icon='ri:facebook-fill'
        width={32}
        className='group-hover:text-primary-300'
      />
    ),
    alt: 'Facebook',
  },
  {
    href: '#',
    icon: (
      <Icon
        icon='mdi:instagram'
        width={32}
        className='group-hover:text-primary-300'
      />
    ),
    alt: 'Instagram',
  },
  {
    href: '#',
    icon: (
      <Icon
        icon='ri:linkedin-fill'
        width={32}
        className='group-hover:text-primary-300'
      />
    ),
    alt: 'Linkedin',
  },
  {
    href: '#',
    icon: (
      <Icon
        icon='ri:tiktok-fill'
        width={32}
        className='group-hover:text-primary-300'
      />
    ),
    alt: 'Tiktok',
  },
];
