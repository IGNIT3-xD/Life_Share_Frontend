"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldSeparator } from "@/components/ui/field";
import { useAuth } from "@/hooks/useAuth";

export type DemoAccount = {
  id: string;
  label: string;
  name: string;
  email: string;
  password: string;
  redirectTo: string;
};

const demoIcons: Record<string, typeof ShieldCheck> = {
  admin: ShieldCheck,
  hospital: Building2,
  donor: UserRound,
};

export function DemoCredentials({
  demoAccounts,
}: {
  demoAccounts: DemoAccount[];
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { mutateAsync: login } = useAuth();
  const router = useRouter();

  if (demoAccounts.length === 0) {
    return null;
  }

  const handleDemoLogin = async (account: DemoAccount) => {
    setPendingId(account.id);
    try {
      await login({
        email: account.email,
        password: account.password,
      });

      toast.success(`Logged in as ${account.name}`, {
        description: `Demo account: ${account.label}`,
      });

      router.push(account.redirectTo);
    } catch (error: any) {
      toast.error("Demo login failed", {
        description: error?.data?.message || "Please try again later.",
      });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
        Or try a demo account
      </FieldSeparator>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {demoAccounts.map((account) => {
          const Icon = demoIcons[account.id] ?? UserRound;
          const isPending = pendingId === account.id;

          return (
            <Field key={account.id}>
              <Button
                type="button"
                variant="outline"
                disabled={pendingId !== null}
                onClick={() => handleDemoLogin(account)}
                className={cn(
                  "border border-slate-200 hover:border-[#B15A36] hover:text-[#B15A36] flex-col h-auto py-2.5 gap-1",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>
                  {isPending ? "Logging in..." : `Login as ${account.label}`}
                </span>
              </Button>
            </Field>
          );
        })}
      </div>
    </div>
  );
}
