export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Clubs',
    href: '/clubs',
    children: [
      { label: 'All Clubs', href: '/clubs' },
      { label: 'Drivers', href: '/clubs?type=driver' },
      { label: 'Putters', href: '/clubs?type=putter' },
      { label: 'Wedges', href: '/clubs?type=wedge' },
    ],
  },
  { label: 'Guides', href: '/guides' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
