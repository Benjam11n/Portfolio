import { createMetadata } from "@repo/seo";
import { Shield } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";

export const metadata = createMetadata({
  description:
    "Privacy policy for Benjamin Wang's portfolio website. Learn how we handle your data.",
  title: "Privacy Policy",
});

export default function PrivacyPage() {
  return (
    <div>
      <SectionCard title="Privacy Policy">
        <div className="mb-6 flex items-center gap-2 text-muted-foreground">
          <Shield className="h-5 w-5" />
          <p>What this site collects, why, and how to reach me.</p>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Last updated: April 19, 2026</p>

          <h3>1. What this policy covers</h3>
          <p>
            This policy explains how Benjamin Wang&apos;s portfolio site handles
            personal information. If you browse the site, use the contact form,
            or click outbound links, some information may be processed to run
            the site, measure usage, and respond to messages.
          </p>

          <h3>2. Information collected</h3>
          <p>This site may collect the following categories of information:</p>
          <ul className="list-disc pl-5">
            <li>
              Contact details you submit, such as your name and email address
            </li>
            <li>Message content you send through the contact form</li>
            <li>
              Technical and usage data, such as page views, browser details,
              device information, referrer data, and interaction events
            </li>
            <li>
              Security-related data used to detect spam, bots, or abusive
              traffic, including IP-based request analysis
            </li>
          </ul>

          <h3>3. How information is used</h3>
          <p>Information is used to:</p>
          <ul className="list-disc pl-5">
            <li>Respond to inquiries sent through the contact form</li>
            <li>Operate, monitor, and improve the site</li>
            <li>Understand site usage and engagement</li>
            <li>Prevent spam, fraud, abuse, and excessive automated traffic</li>
          </ul>

          <h3>4. Services used on this site</h3>
          <p>This site uses third-party services to deliver site features:</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Resend</strong> to deliver contact form submissions to the
              site owner by email
            </li>
            <li>
              <strong>Arcjet</strong> for bot detection, abuse prevention, and
              rate limiting on sensitive actions such as contact form
              submissions
            </li>
            <li>
              <strong>Vercel Analytics</strong> for site analytics and event
              measurement
            </li>
            <li>
              <strong>PostHog</strong> for analytics when enabled in the site
              configuration
            </li>
          </ul>
          <p>
            These providers may process information according to their own terms
            and privacy notices. For example, analytics providers may receive
            usage and device data, and security providers may inspect request
            metadata to block abuse.
          </p>
          <p>
            Vercel Analytics privacy information:{" "}
            <a
              className="text-primary hover:underline"
              href="https://vercel.com/legal/privacy-policy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vercel Privacy Policy
            </a>
            .
          </p>
          <p>
            PostHog privacy information:{" "}
            <a
              className="text-primary hover:underline"
              href="https://posthog.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>
            .
          </p>
          <p>
            Resend privacy information:{" "}
            <a
              className="text-primary hover:underline"
              href="https://resend.com/legal/privacy-policy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>
            .
          </p>

          <h3>5. Contact form details</h3>
          <p>
            If you send a message through the contact form, the submitted name,
            email address, and message are used to respond to you. A hidden
            honeypot field is also used to help detect automated spam.
          </p>

          <h3>6. Retention</h3>
          <p>
            Contact form submissions may be kept for as long as needed to reply,
            continue a conversation, maintain business records, or protect
            against abuse. Analytics and security data retention may vary by
            provider configuration.
          </p>

          <h3>7. Sharing</h3>
          <p>
            Personal information is not sold. Information may be shared with
            service providers that help operate this site, deliver messages,
            provide analytics, or protect the site from abuse.
          </p>

          <h3>8. Your choices and rights</h3>
          <p>
            Depending on where you live, you may have rights to request access
            to, correction of, or deletion of personal information. You can also
            choose not to use the contact form and instead reach out directly by
            email or social links listed on the site.
          </p>

          <h3>9. Changes</h3>
          <p>
            This page may be updated from time to time. The latest version will
            be posted here with a revised effective date.
          </p>

          <h3>10. Contact</h3>
          <p>
            Questions or privacy requests can be sent through the site&apos;s
            contact section or by email at{" "}
            <a
              className="text-primary hover:underline"
              href="mailto:youcanfindbenjamin@gmail.com"
            >
              youcanfindbenjamin@gmail.com
            </a>
            .
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
