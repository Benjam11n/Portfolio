import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/navigation";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8 text-center">
      <span className="font-black text-[clamp(3rem,10vw,8rem)]">404</span>
      <div className="space-y-2">
        <h2 className="font-bold text-2xl tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
      <Button asChild>
        <Link href={ROUTES.HOME}>
          <Home className="mr-2 h-4 w-4" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}
