import { client } from "@/lib/hono";
import { convertMilliUnitsToAmount } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: { from, to, accountId },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch transactions");
      }

      const { data } = await response.json();

      return {
        ...data,
        incomeAmount: convertMilliUnitsToAmount(data.incomeAmount),
        expenseAmount: convertMilliUnitsToAmount(data.expenseAmount),
        remainingAmount: convertMilliUnitsToAmount(data.remainingAmount),
        categories: data.categories.map((category: any) => {
          return {
            ...category,
            value: convertMilliUnitsToAmount(category.value),
          };
        }),
        days: data.days.map((day: any) => {
          return {
            ...day,
            income: convertMilliUnitsToAmount(day.income),
            expenses: convertMilliUnitsToAmount(day.expenses),
          };
        }),
      };
    },
  });

  return query;
};
