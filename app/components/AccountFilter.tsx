"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import qs from "query-string";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

interface Props {}

function AccountFilter(props: Props) {
  const {} = props;

  const pathName = usePathname();
  const router = useRouter();

  const params = useSearchParams();
  const accountId = params?.get("account") || "all";
  const from = params?.get("from") || "";
  const to = params?.get("to") || "";

  const onChangeQuery = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    };

    if (newValue === "all") {
      query.accountId = "";
    }

    const url = qs.stringifyUrl(
      {
        url: pathName,
        query,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  };

  const { data, isLoading } = useGetAccounts();

  const { isLoading: isLoadingSummary } = useGetSummary();

  return (
    <Select
      value={accountId}
      disabled={isLoading || isLoadingSummary}
      onValueChange={onChangeQuery}
    >
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder="Accounts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Accounts</SelectItem>
        {data?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AccountFilter;
