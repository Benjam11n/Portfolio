import React from 'react';
import { useRef, useState, FormEvent, ChangeEvent } from 'react';
import emailjs from '@emailjs/browser';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        'test serviceID',
        'test templateID',
        {
          from_name: form.name,
          to_name: 'Benjamin',
          from_email: form.email,
          to_email: 'youcanfindbenjamin@gmail.com',
          message: form.message,
        },
        'test'
      );
      setLoading(false);

      // TODO: change to toast notification
      alert('Your message has been sent!');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setLoading(false);
      console.log(error);
      // TODO: change to toast notification
      alert('Something went wrong!');
    }
  };

  return (
    <section className="c-space my-20" id="contact">
      <h3 className="head-text">Contact Me</h3>
      <div className="relative min-h-screen flex items-center justify-center flex-col">
        <img
          src="/assets/terminal.png"
          alt="terminal background"
          className="absolute inset-0 min-h-screen mt-6"
        />

        <div className="contact-container">
          <h3 className="head-text">Let&apos;s talk</h3>
          <p className="text-lg text-white-600 mt-3">
            Whether you&apos;re looking to build a new website, improve your
            existing platform, or bring a unique project to life, I&apos;m here
            to help.
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col space-y-7"
          >
            <label className="space-y-3">
              <span className="field-label">Full Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="field-input"
                placeholder="John Doe"
              />
            </label>

            <label className="space-y-3">
              <span className="field-label">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="field-input"
                placeholder="johndoe@gmail.com"
              />
            </label>

            <label className="space-y-3">
              <span className="field-label">Your message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="field-input"
                placeholder="Hi, you're hired!"
              />
            </label>

            <button className="field-btn" type="submit" disabled={loading}>
              {loading ? 'Sending ...' : 'Send Message'}
              <img
                src="/assets/arrow-up.png"
                alt="arrow-up"
                className="field-btn_arrow"
              />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
