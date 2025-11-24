import { FC } from "react";
import { LoadingButton } from "@mui/lab";
import { Trash04 } from "@untitled-ui/icons-react";
import { ApiColorStoreSlice } from "@/api/ApiColorStoreSlice";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ColorItem } from "./ColorTypes";

type ColorDeleteButtonProps = {
  color: ColorItem;
};

const ColorDeleteButton: FC<ColorDeleteButtonProps> = ({ color }) => {
  const confirm = useConfirmDialog();
  const { showSuccessSnackbar, showErrorSnackbar } = useExtendedSnackbar();
  const [deleteColor, deleteColorResult] =
    ApiColorStoreSlice.useDeleteColorMutation();

  const handleDelete = () => {
    confirm({
      title: "Delete color?",
      description: `This will remove "${color.name}" from your catalog.`,
      onConfirm: async () => {
        try {
          const response = await deleteColor({ id: color.id }).unwrap();
          showSuccessSnackbar(
            response?.message || "Color deleted successfully"
          );
        } catch (error: any) {
          showErrorSnackbar(error?.data?.message || "Error occured");
        }
      },
      dialogProps: {
        maxWidth: "xs",
      },
      confirmButtonProps: { color: "error", variant: "contained-error" },
    });
  };

  return (
    <LoadingButton
      size="small"
      variant="text"
      color="error"
      loading={deleteColorResult.isLoading}
      onClick={handleDelete}
      className="!normal-case font-semibold"
    >
      <Trash04 width={16} height={16} />
    </LoadingButton>
  );
};

export default ColorDeleteButton;
