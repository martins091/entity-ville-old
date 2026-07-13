import CareersClient from './CareersClient';

export const metadata = {
  title: 'Careers at Entity Ville - Join Our Team',
  description: 'Explore career opportunities at Entity Ville. Join Africa\'s leading electrical component supplier and build your future with us.',
  alternates: {
    canonical: 'https://entityville.com/careers'
  }
};

export default function CareersPage() {
  return <CareersClient />;
}