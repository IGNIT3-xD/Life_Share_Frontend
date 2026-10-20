import { fetchAllUsersAdmin, fetchForgetPassword, fetchLogin, fetchMe, fetchRegister, fetchResetPassword, fetchVerifyEmail, logout, updateMyProfile, UpdateProfilePayload, updateUserStatus, UpdatUserStatus, UserFilters, type RegisterPayload } from "@/api/auth"
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

export const useUpdateProfile = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ payload, file }: { payload: UpdateProfilePayload, file?: File }) =>
            updateMyProfile(payload, file),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["user_profile"] })
        },
    });
};

export const useLogout = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await qc.cancelQueries();
            qc.clear();
        },
    });
};

// Admin controlled
export const useFetchAllUsers = (filters: UserFilters) => {
    return useQuery({
        queryKey: ["all_users_admin", JSON.stringify(filters)],
        queryFn: () => fetchAllUsersAdmin(filters),
        placeholderData: (prev) => prev
    })
};

export const useUpdateUserStatus = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: UpdatUserStatus }) =>
            updateUserStatus(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["all_users_admin"] })
        },
    });
};