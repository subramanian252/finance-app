import { client } from "@/lib/hono";
import { convertMilliUnitsToAmount } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetTransaction = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch transaction");
      }

      let { data } = await response.json();

      data = {
        ...data,
        amount: convertMilliUnitsToAmount(data.amount),
      };

      return data;
    },
  });

  return query;
};
