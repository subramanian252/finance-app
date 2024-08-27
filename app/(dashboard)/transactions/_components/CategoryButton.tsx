import { Button } from "@/components/ui/button";
import { useEditCategory } from "@/features/category/hooks/useEditAccount";
import { useEditTransaction } from "@/features/transactions/hooks/useEditTransaction";
import { TriangleAlert } from "lucide-react";

interface Props {
  categoryId?: string;
  category?: string;
  id: string;
}

function CategoryButton(props: Props) {
  const { categoryId, category, id } = props;

  const { onOpen } = useEditTransaction();

  if (!categoryId) {
    return (
      <div className=" text-black/90 flex" onClick={() => onOpen(id)}>
        <TriangleAlert className="mr-2 h-4 w-4 " /> <span>Uncategorized</span>
      </div>
    );
  }

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      className=" cursor-pointer"
      onClick={() => onOpen(categoryId)}
    >
      {category}
    </Button>
  );
}

export default CategoryButton;
