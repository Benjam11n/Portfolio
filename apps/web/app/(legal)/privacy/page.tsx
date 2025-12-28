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

          <h3>1. Information Collection</h3>
          <p>
            This website collects minimal information. If you use the contact
            form, the information you provide (name, email, message) is sent
            directly to me via email or Telegram.
          </p>

          <h3>2. Data Storage</h3>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="font-medium text-primary">Important Notice</p>
            <p className="mt-1">
              Your messages are <strong>not stored</strong> in any database
              associated with this website. They are transiently processed to
              deliver the message and then discarded from the server.
            </p>
          </div>

          <h3>3. Cookies</h3>
          <p>
            This website may use essential cookies for site functionality (such
            as theme preference). We do not use tracking cookies for advertising
            purposes.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
