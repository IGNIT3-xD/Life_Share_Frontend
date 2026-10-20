"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert, Lock } from "lucide-react";
import { toast } from "sonner";
import { useUpdateUserStatus } from "@/hooks/useAuth";
import { UserData } from "@/api/auth";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; user: UserData | null; };

export function UpdateUserStatusDialog({ open, onOpenChange, user }: Props) {
    const [isActive, setIsActive] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false);
    const { mutateAsync: updateStatus, isPending } = useUpdateUserStatus();

    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    useEffect(() => {
        if (user) {
            setIsActive(user.is_active);
            setIsBlocked(user.is_blocked);
        }
    }, [user, open]);

    const handleConfirm = async () => {
        if (!user || isSuperAdmin) return;
        try {
            await updateStatus({ id: user.id, payload: { is_active: isActive, is_blocked: isBlocked } });
            toast.success("User status updated successfully");
            onOpenChange(false);
        } catch (err: any) {
            toast.error("Failed to update status", { description: err?.data?.message });
        }
    };

    const hasChanged = user && (isActive !== user.is_active || isBlocked !== user.is_blocked);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm font-graphik">
                <DialogHeader>
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                        isSuperAdmin ? "bg-slate-100" : "bg-blue-50"
                    )}>
                        {isSuperAdmin ? (
                            <Lock className="w-6 h-6 text-slate-500" />
                        ) : (
                            <ShieldAlert className="w-6 h-6 text-blue-600" />
                        )}
                    </div>
                    <DialogTitle>Update Account Status</DialogTitle>
                    <DialogDescription>Manage access for <strong>{user?.name}</strong>.</DialogDescription>
                </DialogHeader>

                {isSuperAdmin && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                        <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                            The status of a <strong>Super Admin</strong> cannot be modified through the dashboard for security reasons.
                        </p>
                    </div>
                )}

                <div className="py-4 space-y-6">
                    {/* Active Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className={cn("text-base", isSuperAdmin && "text-slate-400")}>Active Account</Label>
                            <p className="text-xs text-slate-500">User can log in and use the platform.</p>
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={setIsActive}
                            disabled={isSuperAdmin}
                        />
                    </div>

                    <div className="border-t border-slate-100" />

                    {/* Blocked Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className={cn("text-base text-red-600", isSuperAdmin && "text-slate-400")}>Block User</Label>
                            <p className="text-xs text-slate-500">Prevents login and invalidates active sessions.</p>
                        </div>
                        <Switch
                            checked={isBlocked}
                            onCheckedChange={setIsBlocked}
                            className="data-[state=checked]:bg-red-600"
                            disabled={isSuperAdmin}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Close
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isPending || !hasChanged || isSuperAdmin}
                        className="bg-[#B15A36] hover:bg-[#9a4e2e] text-white"
                    >
                        {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}