import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.category)[":id"]["$delete"]
>;

export const useDeleteCategory = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.category[":id"].$delete({
        param: { id },
      });
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });

      toast.success("category deleted");
    },
    onError: (error) => {
      toast.error("failed to delete category");
    },
  });

  return mutation;
};
