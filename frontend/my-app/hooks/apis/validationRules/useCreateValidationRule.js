import { createValidationRule } from '../../../lib/apis/validationRule/createValidationRule.js';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateValidationRule() {
    const queryClient = useQueryClient();

    const {
        data,
        isError,
        isPending,
        error,
        isSuccess,
        mutateAsync: createRuleMutation,
    } = useMutation({
        mutationFn: (payload) => createValidationRule(payload),

        onSuccess: (responseData, variables) => {
            const count = responseData?.data?.count || variables?.queries?.length || 0;
            toast.success(`${count} Validation rules saved successfully!`);

            queryClient.invalidateQueries({ queryKey: ["datasets"] });
            queryClient.invalidateQueries({ queryKey: ["rules"] });
        },

        onError: (err) => {
            console.error("Mutation Error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to save validation rules");
        },
    });

    return {
        data,
        isError,
        isPending,
        error,
        isSuccess,
        createRuleMutation,
    };
}