import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.account)[":id"]["$delete"]
>;

export const useDeleteAccount = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.account[":id"].$delete({
        param: { id },
      });
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["accounts", { id }] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });

      toast.success("Account deleted");
    },
    onError: (error) => {
      toast.error("failed to delete account");
    },
  });

  return mutation;
};
