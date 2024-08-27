import { client } from "@/lib/hono";
import { convertMilliUnitsToAmount } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: { from, to, accountId },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch transactions");
      }

      let { data } = await response.json();

      if (data) {
        data = data.map((transaction: any) => {
          return {
            ...transaction,
            amount: convertMilliUnitsToAmount(transaction.amount),
          };
        });
      }
      return data;
    },
  });

  return query;
};
