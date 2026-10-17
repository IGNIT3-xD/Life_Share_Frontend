import { fetchForgetPassword, fetchLogin, fetchMe, fetchRegister, fetchResetPassword, fetchVerifyEmail, type RegisterPayload } from "@/api/auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useRegister = () => {
    return useMutation({
        mutationFn: ({ payload, file }: { payload: RegisterPayload; file?: File }) =>
            fetchRegister(payload, file),
    });
};

export const useVerifyEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fetchVerifyEmail,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user_profile"] });
        },
    });
};

export const useForgetPassword = () => {
    return useMutation({
        mutationFn: (email: string) => fetchForgetPassword(email),
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: fetchResetPassword,
    });
};

export const useAuth = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchLogin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user_profile"] })
            // You need to tell React Query to throw away the old cache and fetch fresh data after a successful login.
        }
    })
};

export const useMe = () => {
    return useQuery({
        queryKey: ["user_profile"],
        queryFn: fetchMe,
        retry: false,
        staleTime: 1000 * 60 * 5,
    })
}
