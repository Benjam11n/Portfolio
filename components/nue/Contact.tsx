'use client';

import { SectionCard } from '@/components/nue/SectionCard';
import { CONTACT_INFO } from '@/constants';
import { ArrowUpRight } from 'lucide-react';

export const Contact = () => {
  return (
    <SectionCard id="contact" title="Contact" className="p-8 sm:p-12">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
            <h3 className="text-lg font-medium mb-4">Get in touch</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            
            <div className="flex flex-col gap-4">
                {CONTACT_INFO.map((item) => (
                    <a 
                        key={item.title} 
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary transition-colors group"
                    >
                        <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div className="flex-1">
                            <span className="text-sm font-medium block text-foreground">{item.title}</span>
                            <span className="text-sm text-muted-foreground">{item.value || 'Link'}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                ))}
            </div>
        </div>

        <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input id="name" type="text" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input id="email" type="email" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="john@example.com" />
                </div>
            </div>
            
            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Hello..." />
            </div>

            <button type="submit" className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                Send Message
            </button>
        </form>
      </div>
    </SectionCard>
  );
};
