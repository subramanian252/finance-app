import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.account)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.account)["bulk-delete"]["$post"]
>["json"];

export const useBulkDelete = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.account["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account deleted");
    },
    onError: (error) => {
      console.log(error);
      toast.error("failed to delete account");
    },
  });

  return mutation;
};
