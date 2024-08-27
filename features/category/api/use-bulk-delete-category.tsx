import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.category)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.category)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.category["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });

      toast.success("category deleted");
    },
    onError: (error) => {
      console.log(error);
      toast.error("failed to delete category");
    },
  });

  return mutation;
};
