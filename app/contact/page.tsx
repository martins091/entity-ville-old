import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Entity Ville - Get in Touch',
  description: 'Contact Entity Ville Ltd for quotes, technical support, and enquiries about electrical components. We\'re here to help!',
  alternates: {
    canonical: 'https://entityville.com/contact'
  }
};

export default function ContactPage() {
  return <ContactClient />;
}