import { Button } from "@/components/ui/button";
import { useEditAccount } from "@/features/accounts/hooks/useEditAccount";
import React from "react";

interface Props {
  accountId: string;
  account: string;
}

function AccountButton(props: Props) {
  const { accountId, account } = props;

  const { onOpen } = useEditAccount();

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      className=" cursor-pointer"
      onClick={() => onOpen(accountId)}
    >
      {account}
    </Button>
  );
}

export default AccountButton;
