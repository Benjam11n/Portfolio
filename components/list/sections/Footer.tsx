import Link from 'next/link';

const Footer = () => {
  return (
    <section className="c-space flex flex-wrap items-center justify-between gap-5 border-t pt-8 pb-24">
      <div className="flex gap-2">
        <p>Terms & Conditions</p>
        <p>|</p>
        <Link href="/credits" className="hover:text-primary transition-colors">
          Credits
        </Link>
      </div>
      <p>© 2025 Benjamin. All rights reserved</p>
    </section>
  );
};

export default Footer;
