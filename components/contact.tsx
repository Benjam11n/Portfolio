"use client";

import { useGSAP } from "@gsap/react";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

gsap.registerPlugin(ScrollTrigger);

import { SectionCard } from "@/components/section-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_INFO } from "@/constants";
import { sendEmailAction } from "@/lib/actions/email";
import { ShiftSubmitButton } from "./shift-submit-button";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export const Contact = () => {
  const filteredContactInfo = CONTACT_INFO.filter((item) =>
    ["Email", "Telegram", "LinkedIn"].includes(item.title)
  );

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await sendEmailAction(values);

      if (result.error) {
        toast.error("Error", {
          description: result.error,
        });
      } else {
        toast.success("Success", {
          description: "Message sent! I'll get back to you soon.",
        });
        form.reset();
      }
    });
  }

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(containerRef.current, { autoAlpha: 0, y: 30 });

      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <SectionCard id="contact" title="Contact">
      <div className="flex flex-col gap-4" ref={containerRef}>
        <div>
          <p className="mb-8 max-w-md font-sans text-md text-muted-foreground">
            I&apos;m always open to new projects, collaborations, or a
            conversation about design. If you have an idea in mind or want to
            connect, feel free to get in touch.
          </p>

          <div className="flex items-center gap-4">
            {filteredContactInfo.map((item) => (
              <a
                className="group relative transition-transform hover:scale-110"
                href={item.link}
                key={item.title}
                rel="noreferrer"
                target="_blank"
              >
                <item.icon className="h-5 w-5 text-foreground transition-colors duration-300" />
                <span className="sr-only">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block font-medium text-sm">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block font-medium text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="johndoe@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 block font-medium text-sm">
                    Subject
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-card"
                      placeholder="Project Inquiry"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 block font-medium text-sm">
                    Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-card"
                      placeholder="Hello! I want to give you a job..."
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ShiftSubmitButton isLoading={isPending} type="submit">
              Submit
            </ShiftSubmitButton>
          </form>
        </Form>
      </div>
    </SectionCard>
  );
};
