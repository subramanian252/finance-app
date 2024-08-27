import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRef, useState } from "react";
import { UseCreateAccount } from "../api/use-create-account";
import { useGetAccounts } from "../api/use-get-accounts";
import SelectComponent from "@/app/components/SelectComponent";

export function useSelectAccount(): [
  () => JSX.Element,
  () => Promise<unknown>
] {
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const accountMutation = UseCreateAccount();

  const accountQuery = useGetAccounts();

  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };

  const accountOptions = accountQuery.data?.map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const selectValue = useRef<string>();

  const confirm = () => {
    return new Promise((resolve, reject) => {
      setPromise({
        resolve,
      });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(selectValue.current);
      handleClose();
    }
  };

  const handleCancel = () => {
    if (promise) {
      promise.resolve(undefined);
      handleClose();
    }
  };

  const DailogModel = () => {
    return (
      <Dialog open={promise !== null}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Account</DialogTitle>
            <DialogDescription>Please Select an Account</DialogDescription>
          </DialogHeader>
          <SelectComponent
            placeholder="Select an account"
            options={accountOptions}
            value={selectValue.current}
            onCreate={onCreateAccount}
            onChange={(value) => (selectValue.current = value)}
            disabled={accountMutation.isPending}
          />
          <DialogFooter>
            <Button onClick={handleCancel} variant={"outline"}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [DailogModel, confirm];
}
