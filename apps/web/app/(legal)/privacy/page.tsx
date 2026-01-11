import { Shield } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

export default function PrivacyPage() {
  return (
    <div>
      <SectionCard title="Privacy Policy">
        <div className="mb-6 flex items-center gap-2 text-muted-foreground">
          <Shield className="h-5 w-5" />
          <p>How we handle your data.</p>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h3>1. Introduction</h3>
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>

          <h3>2. Information We Collect</h3>
          <p>
            While using Our Service, We may ask You to provide Us with certain
            personally identifiable information that can be used to contact or
            identify You. Personally identifiable information may include, but
            is not limited to:
          </p>
          <ul className="list-disc pl-5">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Usage Data</li>
          </ul>

          <h3>3. Usage Data & Third-Party Services</h3>
          <p>
            We use <strong>Google reCAPTCHA</strong> to protect our contact
            forms from spam and abuse. This service may collect hardware and
            software information, such as device and application data, and send
            it to Google for analysis. The information collected in connection
            with your use of the service will be used for improving reCAPTCHA
            and for general security purposes. It will not be used for
            personalized advertising by Google.
          </p>
          <p>
            Your use of reCAPTCHA is subject to the Google{" "}
            <a
              className="text-primary hover:underline"
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              className="text-primary hover:underline"
              href="https://policies.google.com/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Use
            </a>
            .
          </p>

          <h3>4. How We Use Your Information</h3>
          <p>
            The information you provide via the contact form (Name, Email,
            Subject, Message) is used solely to communicate with you regarding
            your inquiry.
          </p>

          <h3>5. Data Retention</h3>
          <p>
            We will retain Your Personal Data only for as long as is necessary
            for the purposes set out in this Privacy Policy. We will retain and
            use Your Personal Data to the extent necessary to comply with our
            legal obligations (for example, if we are required to retain your
            data to comply with applicable laws), resolve disputes, and enforce
            our legal agreements and policies.
          </p>

          <h3>6. Your Data Protection Rights</h3>
          <p>
            Depending on your location, you may have rights under data
            protection laws (such as GDPR or CCPA) regarding your personal data,
            including the right to access, correct, or delete your personal
            data. If you wish to exercise any of these rights, please contact us
            using the information below.
          </p>

          <h3>7. Changes to this Privacy Policy</h3>
          <p>
            We may update Our Privacy Policy from time to time. We will notify
            You of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any
            changes.
          </p>

          <h3>8. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, You can contact
            us by visiting the contact section of our website.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
