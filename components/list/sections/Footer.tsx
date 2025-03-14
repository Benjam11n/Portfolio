import Link from 'next/link';

const Footer = () => {
  return (
    <section className="c-space flex flex-wrap items-center justify-between gap-5 border-t pb-24 pt-8">
      <div className="flex gap-2">
        <p>Terms & Conditions</p>
        <p>|</p>
        <Link href="/credits" className="transition-colors hover:text-primary">
          Credits
        </Link>
      </div>
      <p>© 2024 Benjamin. All rights reserved</p>
    </section>
  );
};

export default Footer;
