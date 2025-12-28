import { Sparkles } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

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

          <h3>1. Introduction</h3>
          <p>
            Welcome to my portfolio. By accessing this website, you agree to be
            bound by these Terms of Service and all applicable laws and
            regulations.
          </p>

          <h3>2. Intellectual Property</h3>
          <p>
            The content, features, and functionality of this portfolio are owned
            by Benjamin Wang and are protected by international copyright,
            trademark, patent, trade secret, and other intellectual property or
            proprietary rights laws.
          </p>

          <h3>3. Disclaimer</h3>
          <p>
            The materials on this website are provided on an 'as is' basis. I
            make no warranties, expressed or implied, and hereby disclaim and
            negate all other warranties including, without limitation, implied
            warranties or conditions of merchantability, fitness for a
            particular purpose, or non-infringement of intellectual property or
            other violation of rights.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
