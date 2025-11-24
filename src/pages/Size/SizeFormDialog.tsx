import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ApiSizeStoreSlice } from "@/api/ApiSizeStoreSlice";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import { SizeItem } from "./SizeTypes";

type SizeFormDialogProps = {
  open: boolean;
  onClose: () => void;
  size?: SizeItem;
};

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Size name is required"),
});

const SizeFormDialog: FC<SizeFormDialogProps> = ({ open, onClose, size }) => {
  const { showSuccessSnackbar, showErrorSnackbar } = useExtendedSnackbar();
  const [createSize, createSizeResult] =
    ApiSizeStoreSlice.useCreateSizeMutation();
  const [updateSize, updateSizeResult] =
    ApiSizeStoreSlice.useUpdateSizeMutation();

  const isEditing = Boolean(size?.id);
  const isLoading = createSizeResult.isLoading || updateSizeResult.isLoading;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: size?.name || "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const payload = {
          name: values.name.trim(),
        };

        const response = isEditing
          ? await updateSize({ id: size?.id, ...payload }).unwrap()
          : await createSize(payload).unwrap();

        showSuccessSnackbar(
          response?.message ||
            (isEditing ? "Size updated successfully" : "Size created successfully")
        );

        helpers.resetForm();
        onClose();
      } catch (error: any) {
        showErrorSnackbar(error?.data?.message || "Error occured");
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (
          isLoading &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        )
          return;
        onClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle className="font-bold font-crimson">
          <Typography
            color="grey.700"
            className="text-base font-medium capitalize font-inter"
          >
            {isEditing ? "Edit size" : "Add new size"}
          </Typography>
        </DialogTitle>

        <DialogContent className="pt-2">
          <TextField
            variant="outlined"
            className="capitalize MuiTextFieldOutlined--plain"
            size="small"
            autoFocus
            margin="dense"
            id="name"
            name="name"
            placeholder="e.g. Large"
            type="text"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button
            className="font-semibold capitalize"
            variant="outlined"
            onClick={onClose}
            color="inherit"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            className="font-semibold capitalize"
            loading={isLoading}
          >
            {isEditing ? "Save changes" : "Create size"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SizeFormDialog;
