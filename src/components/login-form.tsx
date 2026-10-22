"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUserValidation } from "@/app/(auth)/login/_validators/auth.validation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import loginAnimation from "../../public/Waiting.json"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync: login, isPending } = useAuth()

  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginUserValidation
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        await login({
          email: value.email,
          password: value.password
        })

        toast.success("Successfully Login", {
          description: `Welcome to Life Share`
        })

        router.push('/')
      } catch (error: any) {
        setServerError(error?.data?.message || "Invalid email or password. Please try again.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl md:text-3xl lg:text-4xl text-primary">
                  Welcome back
                </h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Life share account
                </p>
              </div>

              {serverError && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md text-center">
                  {serverError}
                </div>
              )}

              {/* EMAIL FIELD */}
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="m@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {/* 3. UPDATE ERROR RENDERING (Zod returns objects with a .message property) */}
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {field.state.meta.errors.map((err) => typeof err === 'string' ? err : err?.message).join(", ")}
                      </p>
                    )}
                  </Field>
                )}
              </form.Field>

              {/* PASSWORD FIELD */}
              <form.Field name="password">
                {(field) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link
                        href="/forget-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={field.state.meta.errors.length > 0}
                      placeholder="******"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {field.state.meta.errors.map((err) => typeof err === 'string' ? err : err?.message).join(", ")}
                      </p>
                    )}
                  </Field>
                )}
              </form.Field>

              {/* SUBMIT BUTTON */}
              <Field>
                <form.Subscribe
                  selector={(state) => [state.canSubmit]}
                >
                  {([canSubmit]) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit || isPending}
                      className="btn-main bg-[#B15A36] w-full"
                    >
                      {isPending ? "Logging in..." : "Login"}
                    </Button>
                  )}
                </form.Subscribe>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field className="max-w-3xs mx-auto">
                <Button
                  variant="outline"
                  type="button"
                  className="border border-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/register">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-[#F8F9FA] md:flex items-center justify-center p-8 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-orange-50/50 to-transparent pointer-events-none" />
            <DotLottieReact
              data={loginAnimation}
              loop
              autoplay
              className="w-full max-w-md relative z-10"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="/login">Terms of Service</a>{" "}
        and <a href="/login">Privacy Policy</a>.
      </FieldDescription>
    </div >
  );
}