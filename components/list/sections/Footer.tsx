const Footer = () => {
  return (
    <section className="c-space pt-8 pb-24 border-t border-black-300 flex justify-between items-center flex-wrap gap-5">
      <div className="text-white-500 flex gap-2">
        <p>Terms & Conditions</p>
        <p>|</p>
        <p>Privacy Policy</p>
      </div>

      <div className="flex gap-3">
        <a href="https://github.com/Benjam11n" target="_blank" rel="noreferrer">
          <div className="social-icon">
            <img
              src="/assets/github.svg"
              alt="github"
              className="w-1/2 h-1/2"
            />
          </div>
        </a>
        <a
          href="https://www.linkedin.com/in/benjaminwang-sg/"
          target="_blank"
          rel="noreferrer"
        >
          <div className="social-icon">
            <img
              src="/assets/linkedin.svg"
              alt="linkedin"
              className="w-1/2 h-1/2 invert"
            />
          </div>
        </a>
      </div>

      <p className="text-white-500">© 2024 Benjamin. All rights reserved</p>
    </section>
  );
};

export default Footer;
