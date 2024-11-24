"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from "@/app/(auth)/zod-schemas";
import { Loader2Icon } from "lucide-react";

type AuthFormProps = {
  mode?: "sign-in" | "sign-up";
};

export const AuthForm = ({ mode = "sign-in" }: AuthFormProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<SignInValues | SignUpValues>({
    resolver:
      mode === "sign-in"
        ? zodResolver(signInSchema)
        : zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInValues | SignUpValues) => {
    console.log(values);
  };

  return (
    <Card className="w-full sm:max-w-[400px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {mode === "sign-in" ? "Sign in to your account" : "Create an account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {mode === "sign-up" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <b>*</b>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        aria-required="true"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <b>*</b>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe@gmail.com"
                      {...field}
                      aria-required="true"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <b>*</b>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      aria-required="true"
                      autoComplete={
                        mode === "sign-in" ? "current-password" : "new-password"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2Icon className="size-4 animate-spin" />}
              {mode === "sign-in" ? "Sign in" : "Sign up"}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-secondary text-muted-foreground rounded">
                {mode === "sign-in"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              asChild
              variant="outline"
              className="w-full focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"}>
                {mode === "sign-in" ? "Create an account" : "Sign in"}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
