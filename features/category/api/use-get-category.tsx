import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetCategory = (id: string | undefined) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      const response = await client.api.category[":id"].$get({ param: { id } });

      if (response.status !== 200) {
        throw new Error("Failed to fetch category");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
