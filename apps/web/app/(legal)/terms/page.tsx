import { createMetadata } from "@repo/seo";
import { Sparkles } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "Terms of service for Benjamin Wang's portfolio website.",
});

export default function TermsPage() {
  return (
    <div>
      <SectionCard title="Terms of Service">
        <div className="mb-6 flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-5 w-5" />
          <p>Please read these terms carefully before using our service.</p>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using this website, you accept and agree to be
            bound by the terms and provision of this agreement. In addition,
            when using this website's services, you shall be subject to any
            posted guidelines or rules applicable to such services.
          </p>

          <h3>2. Intellectual Property</h3>
          <p>
            The content, features, and functionality of this portfolio are owned
            by Benjamin Wang and are protected by international copyright,
            trademark, patent, trade secret, and other intellectual property or
            proprietary rights laws.
          </p>

          <h3>3. User Conduct</h3>
          <p>
            You agree not to use the website or its services (including the
            contact form) to:
          </p>
          <ul className="list-disc pl-5">
            <li>
              Send unsolicited or unauthorized advertising, promotional
              materials, "junk mail," "spam," "chain letters," or any other form
              of solicitation.
            </li>
            <li>
              Transmit any worms, viruses, or any code of a destructive nature.
            </li>
            <li>
              Attempt to gain unauthorized access to any portion or feature of
              the site.
            </li>
          </ul>

          <h3>4. Links To Other Websites</h3>
          <p>
            Our Service may contain links to third-party web sites or services
            that are not owned or controlled by Us (e.g., LinkedIn, GitHub). We
            has no control over, and assumes no responsibility for, the content,
            privacy policies, or practices of any third party web sites or
            services. You further acknowledge and agree that We shall not be
            responsible or liable, directly or indirectly, for any damage or
            loss caused or alleged to be caused by or in connection with the use
            of or reliance on any such content, goods or services available on
            or through any such web sites or services.
          </p>

          <h3>5. Limitation of Liability</h3>
          <p>
            In no event shall Benjamin Wang, nor his partners, agents,
            suppliers, or affiliates, be liable for any indirect, incidental,
            special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from (i) your access to or use of or
            inability to access or use the Service; (ii) any conduct or content
            of any third party on the Service; (iii) any content obtained from
            the Service; and (iv) unauthorized access, use or alteration of your
            transmissions or content, whether based on warranty, contract, tort
            (including negligence) or any other legal theory, whether or not we
            have been informed of the possibility of such damage.
          </p>

          <h3>6. Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws of Singapore, without regard to its conflict of law provisions.
          </p>

          <h3>7. Changes to Terms</h3>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. By continuing to access or use our Service
            after those revisions become effective, you agree to be bound by the
            revised terms.
          </p>

          <h3>8. Contact Us</h3>
          <p>
            If you have any questions about these Terms, please contact us via
            the contact form on this website.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
