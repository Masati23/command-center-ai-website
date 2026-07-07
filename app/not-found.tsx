import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <LogoMark className="h-14 w-14" />
      <h1 className="mt-8 text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 max-w-md text-silver-400">
        The page you're looking for doesn't exist or has moved.
      </p>
      <div className="mt-8">
        <Button href="/">Back to Home</Button>
      </div>
    </div>
  );
}
