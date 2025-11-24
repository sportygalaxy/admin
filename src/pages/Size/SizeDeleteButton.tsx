import { FC } from "react";
import { LoadingButton } from "@mui/lab";
import { Trash04 } from "@untitled-ui/icons-react";
import { ApiSizeStoreSlice } from "@/api/ApiSizeStoreSlice";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { SizeItem } from "./SizeTypes";

type SizeDeleteButtonProps = {
  size: SizeItem;
};

const SizeDeleteButton: FC<SizeDeleteButtonProps> = ({ size }) => {
  const confirm = useConfirmDialog();
  const { showSuccessSnackbar, showErrorSnackbar } = useExtendedSnackbar();
  const [deleteSize, deleteSizeResult] =
    ApiSizeStoreSlice.useDeleteSizeMutation();

  const handleDelete = () => {
    confirm({
      title: "Delete size?",
      description: `This will remove "${size.name}" from your catalog.`,
      onConfirm: async () => {
        try {
          const response = await deleteSize({ id: size.id }).unwrap();
          showSuccessSnackbar(response?.message || "Size deleted successfully");
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
      disabled
      size="small"
      variant="text"
      color="error"
      loading={deleteSizeResult.isLoading}
      onClick={handleDelete}
      className="!normal-case font-semibold"
    >
      <Trash04 width={16} height={16} />
    </LoadingButton>
  );
};

export default SizeDeleteButton;
