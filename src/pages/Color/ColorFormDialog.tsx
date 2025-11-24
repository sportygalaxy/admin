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
import { ApiColorStoreSlice } from "@/api/ApiColorStoreSlice";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import { ColorItem } from "./ColorTypes";

type ColorFormDialogProps = {
  open: boolean;
  onClose: () => void;
  color?: ColorItem;
};

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Color name is required"),
});

const ColorFormDialog: FC<ColorFormDialogProps> = ({
  open,
  onClose,
  color,
}) => {
  const { showSuccessSnackbar, showErrorSnackbar } = useExtendedSnackbar();
  const [createColor, createColorResult] =
    ApiColorStoreSlice.useCreateColorMutation();
  const [updateColor, updateColorResult] =
    ApiColorStoreSlice.useUpdateColorMutation();

  const isEditing = Boolean(color?.id);
  const isLoading = createColorResult.isLoading || updateColorResult.isLoading;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: color?.name || "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const payload = {
          name: values.name.trim(),
        };

        const response = isEditing
          ? await updateColor({ id: color?.id, ...payload }).unwrap()
          : await createColor(payload).unwrap();

        showSuccessSnackbar(
          response?.message ||
            (isEditing
              ? "Color updated successfully"
              : "Color created successfully")
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
            {isEditing ? "Edit color" : "Add new color"}
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
            placeholder="e.g. Blue"
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
            {isEditing ? "Save changes" : "Create color"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ColorFormDialog;
