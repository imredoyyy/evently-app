"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
interface GoogleLoginButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  redirect: string;
}

export const GoogleLoginButton = ({
  redirect,
  className,
  ...props
}: GoogleLoginButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: redirect,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message ?? "Something went wrong. Please try again.");
      return;
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      size="sm"
      className={cn(className)}
      disabled={loading}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="text-background"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M12 11H20.5329C20.5769 11.3847 20.6 11.7792 20.6 12.1837C20.6 14.9184 19.6204 17.2204 17.9224 18.7837C16.4367 20.1551 14.404 20.9592 11.9796 20.9592C8.46933 20.9592 5.43266 18.947 3.9551 16.0123C3.34695 14.8 3 13.4286 3 11.9796C3 10.5306 3.34695 9.1592 3.9551 7.94698C5.43266 5.01226 8.46933 3 11.9796 3C14.4 3 16.4326 3.88983 17.9877 5.33878L16.5255 6.80101C15.3682 5.68153 13.8028 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.5265 19 18.1443 16.3923 18.577 13H12V11Z"></path>
      </svg>
      <span>Sign in with Google</span>
    </Button>
  );
};
