"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MenuIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useConfirm } from "@/hooks/use-confirm";
import { useEditCategory } from "@/features/category/hooks/useEditAccount";
import { useDeleteCategory } from "@/features/category/api/use-delete-category";

interface Props {
  id: string;
}

function ActionCategory(props: Props) {
  const [DialogModel, confirm] = useConfirm({
    title: "Delete",
    description: "Are you sure you want to delete?",
  });
  const { id } = props;

  const { onOpen, onClose } = useEditCategory();

  const deleteMutation = useDeleteCategory(id);

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <DialogModel />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant={"ghost"}
            className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-transparent"
            aria-label={"Actions"}
            size={"sm"}
          >
            <MenuIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button onClick={() => onOpen(id)} variant={"ghost"} size={"sm"}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button onClick={onDelete} variant={"ghost"} size={"sm"}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default ActionCategory;
