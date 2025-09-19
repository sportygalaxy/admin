import { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Trash04 } from "@untitled-ui/icons-react";
import { Typography } from "@mui/material";

const validationSchema = Yup.object({
  variants: Yup.array().of(
    Yup.object().shape({
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be positive"),
      stock: Yup.number()
        .required("Stock is required")
        .positive("Stock must be positive"),
      colorId: Yup.string(),
      sizeId: Yup.string(),
      dimension: Yup.string(),
      weight: Yup.number().positive("Weight must be positive"),
    })
  ),
});

interface VariantFormValues {
  variants: Array<{
    price: number;
    stock: number;
    colorId?: string;
    sizeId?: string;
    dimension?: string;
    weight?: number | string;
  }>;
}

const VariantForm: FC = () => {
  const formik = useFormik<VariantFormValues>({
    initialValues: {
      variants: [
        {
          price: 0,
          stock: 0,
          colorId: "0",
        },
        {
          price: 0,
          stock: 0,
          sizeId: "0",
        },
        {
          price: 0,
          stock: 0,
          dimension: "0",
        },
        {
          price: 0,
          stock: 0,
          weight: "0",
        },
      ],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted", values);
    },
  });

  const addField = (type: string) => {
    formik.setFieldValue("variants", [
      ...formik.values.variants,
      { price: "0", stock: "0", [type]: "0" },
    ]);
  };

  const removeField = (index: number) => {
    const updatedVariants = formik.values.variants.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("variants", updatedVariants);
  };

  console.log("FORMIK - variants", formik.values);

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
        {/* Color Section */}
        <div>
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="keyattributes"
          >
            Add Color Variants
          </Typography>

          {formik.values.variants
            .filter((variant) => variant.colorId)
            .map((variant, index) => (
              <div key={index} className="flex mb-4 space-x-2">
                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Price
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].price`}
                    value={variant.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variants?.[index]?.price &&
                      Boolean(formik.errors.variants?.[index]?.price)
                    }
                    helperText={
                      formik.touched.variants?.[index]?.price &&
                      formik.errors.variants?.[index]?.price
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Stock
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].stock`}
                    value={variant.stock}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variants?.[index]?.stock &&
                      Boolean(formik.errors.variants?.[index]?.stock)
                    }
                    helperText={
                      formik.touched.variants?.[index]?.stock &&
                      formik.errors.variants?.[index]?.stock
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Color ID
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].colorId`}
                    value={variant.colorId}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </div>

                <IconButton onClick={() => removeField(index)}>
                  <Trash04 className="text-red-500" />
                </IconButton>
              </div>
            ))}
          <Button
            variant="ghost"
            size="small"
            className="capitalize"
            type="button"
            onClick={() => addField("colorId")}
          >
            Add Color Variant
          </Button>
        </div>

        {/* Size Section */}
        <div>
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="keyattributes"
          >
            Add Size Variants
          </Typography>

          {formik.values.variants
            .filter((variant) => variant.sizeId)
            .map((variant, index) => (
              <div key={index} className="flex mb-4 space-x-2">
                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Price
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].price`}
                    value={variant.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variants?.[index]?.price &&
                      Boolean(formik.errors.variants?.[index]?.price)
                    }
                    helperText={
                      formik.touched.variants?.[index]?.price &&
                      formik.errors.variants?.[index]?.price
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Stock
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].stock`}
                    value={variant.stock}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variants?.[index]?.stock &&
                      Boolean(formik.errors.variants?.[index]?.stock)
                    }
                    helperText={
                      formik.touched.variants?.[index]?.stock &&
                      formik.errors.variants?.[index]?.stock
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Size ID
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].sizeId`}
                    value={variant.sizeId}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </div>
                <IconButton onClick={() => removeField(index)}>
                  <Trash04 className="text-red-500" />
                </IconButton>
              </div>
            ))}
          <Button
            variant="ghost"
            size="small"
            className="capitalize"
            type="button"
            onClick={() => addField("sizeId")}
          >
            Add Size Variant
          </Button>
        </div>

        {/* Dimension Section */}
        <div>
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="keyattributes"
          >
            Add Dimension Variants
          </Typography>
          {formik.values.variants
            .filter((variant) => variant.dimension)
            .map((variant, index) => (
              <div key={index} className="flex mb-4 space-x-2">
                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Price
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].price`}
                    value={variant.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variants?.[index]?.price &&
                      Boolean(formik.errors.variants?.[index]?.price)
                    }
                    helperText={
                      formik.touched.variants?.[index]?.price &&
                      formik.errors.variants?.[index]?.price
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Stock
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].stock`}
                    value={variant.stock}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variants?.[index]?.stock &&
                      Boolean(formik.errors.variants?.[index]?.stock)
                    }
                    helperText={
                      formik.touched.variants?.[index]?.stock &&
                      formik.errors.variants?.[index]?.stock
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Dimension eg. (2x2, 2ft, 2inches)
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].dimension`}
                    value={variant.dimension}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </div>
                <IconButton onClick={() => removeField(index)}>
                  <Trash04 className="text-red-500" />
                </IconButton>
              </div>
            ))}
          <Button
            variant="ghost"
            size="small"
            className="capitalize"
            type="button"
            onClick={() => addField("dimension")}
          >
            Add Dimension Variant
          </Button>
        </div>

        {/* Weight Section */}
        <div>
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="keyattributes"
          >
            Add Weight Variants
          </Typography>
          {formik.values.variants
            .filter((variant) => variant.weight)
            .map((variant, index) => (
              <div key={index} className="flex mb-4 space-x-2">
                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Price
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].price`}
                    value={variant.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variants?.[index]?.price &&
                      Boolean(formik.errors.variants?.[index]?.price)
                    }
                    helperText={
                      formik.touched.variants?.[index]?.price &&
                      formik.errors.variants?.[index]?.price
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Stock
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].stock`}
                    value={variant.stock}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variants?.[index]?.stock &&
                      Boolean(formik.errors.variants?.[index]?.stock)
                    }
                    helperText={
                      formik.touched.variants?.[index]?.stock &&
                      formik.errors.variants?.[index]?.stock
                    }
                    fullWidth
                  />
                </div>

                <div>
                  <Typography
                    color="grey.400"
                    component="label"
                    className="text-sm font-medium capitalize font-inter"
                    htmlFor="keyattributes"
                  >
                    Weight (kg, g, lbs)
                  </Typography>
                  <TextField
                    className="capitalize MuiTextFieldOutlined--plain"
                    name={`variants[${index}].weight`}
                    value={variant.weight}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </div>
                <IconButton onClick={() => removeField(index)}>
                  <Trash04 className="text-red-500" />
                </IconButton>
              </div>
            ))}
          <Button
            variant="ghost"
            size="small"
            className="capitalize"
            type="button"
            onClick={() => addField("weight")}
          >
            Add Weight Variant
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VariantForm;
