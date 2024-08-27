import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.account)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.account)[":id"]["$patch"]
>["json"];

export const useEditAccountMutation = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.account[":id"].$patch({
        json,
        param: { id },
      });
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["accounts", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      toast.success("Account Edited");
    },
    onError: (error) => {
      toast.error("failed to edit account");
    },
  });

  return mutation;
};
