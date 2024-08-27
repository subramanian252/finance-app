import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetAccount = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["accounts", { id }],
    queryFn: async () => {
      const response = await client.api.account[":id"].$get({ param: { id } });

      if (response.status !== 200) {
        throw new Error("Failed to fetch accounts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
