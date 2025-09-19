import { FC } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating unique ids
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Trash04 } from "@untitled-ui/icons-react";
import { Typography } from "@mui/material";
import { removeIdAndMergeArrays } from "./utils/remove-id-and-merge-array";

interface ProductVarientsProps {
  formik: any;
}

const ProductVariants: FC<ProductVarientsProps> = ({ formik }) => {
  // Function to add a new field to the variants array with a unique id
  const addFieldColor = (type: string) => {
    const newVariant = {
      id: uuidv4(), // Generate a unique id for each new variant
      price: 0,
      stock: 0,
      [type]: "0",
    };
    formik.setFieldValue("variantsColor", [
      ...formik.values.variantsColor,
      newVariant,
    ]);
  };
  const addFieldSize = (type: string) => {
    const newVariant = {
      id: uuidv4(), // Generate a unique id for each new variant
      price: 0,
      stock: 0,
      [type]: "0",
    };
    formik.setFieldValue("variantsSize", [
      ...formik.values.variantsSize,
      newVariant,
    ]);
  };
  const addFieldDimension = (type: string) => {
    const newVariant = {
      id: uuidv4(), // Generate a unique id for each new variant
      price: 0,
      stock: 0,
      [type]: "0",
    };
    formik.setFieldValue("variantsDimension", [
      ...formik.values.variantsDimension,
      newVariant,
    ]);
  };
  const addFieldWeight = (type: string) => {
    const newVariant = {
      id: uuidv4(), // Generate a unique id for each new variant
      price: 0,
      stock: 0,
      [type]: "0",
    };
    formik.setFieldValue("variantsWeight", [
      ...formik.values.variantsWeight,
      newVariant,
    ]);
  };

  // Function to remove a specific field based on its unique id
  const removeFieldc = (id: string) => {
    const updatedVariantsc = formik.values.variantsColor.filter(
      (variant) => variant.id !== id
    );
    formik.setFieldValue("variantsColor", updatedVariantsc);
  };
  const removeFields = (id: string) => {
    const updatedVariants = formik.values.variantsSize.filter(
      (variant) => variant.id !== id
    );
    formik.setFieldValue("variantsSize", updatedVariants);
  };
  const removeFieldd = (id: string) => {
    const updatedVariants = formik.values.variantsDimension.filter(
      (variant) => variant.id !== id
    );
    formik.setFieldValue("variantsDimension", updatedVariants);
  };
  const removeFieldw = (id: string) => {
    const updatedVariants = formik.values.variantsWeight.filter(
      (variant) => variant.id !== id
    );
    formik.setFieldValue("variantsWeight", updatedVariants);
  };

  console.log("FORMIK", formik.values);
  console.log(
    "FORMIK - FLat",
    removeIdAndMergeArrays(
      formik.values.variantsColor,
      formik.values.variantsSize,
      formik.values.variantsDimension,
      formik.values.variantsWeight
    )
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full space-y-6">
        {/* Color Section */}
        <div className="flex flex-col w-fit">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="keyattributes"
          >
            Add Color Variants
          </Typography>

          {formik.values.variantsColor
            .filter((variant) => variant.colorId)
            .map((variant, index) => (
              <div key={variant.id} className="flex mb-4 space-x-2">
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
                    name={`variantsColor[${index}].price`}
                    value={variant.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variantsColor?.[index]?.price &&
                      Boolean(formik.errors.variantsColor?.[index]?.price)
                    }
                    helperText={
                      formik.touched.variantsColor?.[index]?.price &&
                      formik.errors.variantsColor?.[index]?.price
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
                    name={`variantsColor[${index}].stock`}
                    value={variant.stock}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variantsColor?.[index]?.stock &&
                      Boolean(formik.errors.variantsColor?.[index]?.stock)
                    }
                    helperText={
                      formik.touched.variantsColor?.[index]?.stock &&
                      formik.errors.variantsColor?.[index]?.stock
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
                    name={`variantsColor[${index}].colorId`}
                    value={variant.colorId}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </div>

                <IconButton onClick={() => removeFieldc(variant.id)}>
                  <Trash04 className="text-red-500" />
                </IconButton>
              </div>
            ))}
          <Button
            variant="ghost"
            size="small"
            className="capitalize w-fit"
            type="button"
            onClick={() => addFieldColor("colorId")}
          >
            Add Color Variant
          </Button>
        </div>

        {/* Size Section */}
        <div className="flex flex-col w-fit">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="keyattributes"
          >
            Add Size Variants
          </Typography>

          {formik.values.variantsSize
            .filter((variant) => variant.sizeId)
            .map((variant, index) => (
              <div key={variant.id} className="flex mb-4 space-x-2">
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
                    name={`variantsSize[${index}].price`}
                    value={variant.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variantsSize?.[index]?.price &&
                      Boolean(formik.errors.variantsSize?.[index]?.price)
                    }
                    helperText={
                      formik.touched.variantsSize?.[index]?.price &&
                      formik.errors.variantsSize?.[index]?.price
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
                    name={`variantsSize[${index}].stock`}
                    value={variant.stock}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variantsSize?.[index]?.stock &&
                      Boolean(formik.errors.variantsSize?.[index]?.stock)
                    }
                    helperText={
                      formik.touched.variantsSize?.[index]?.stock &&
                      formik.errors.variantsSize?.[index]?.stock
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
                    name={`variantsSize[${index}].sizeId`}
                    value={variant.sizeId}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </div>
                <IconButton onClick={() => removeFields(variant.id)}>
                  <Trash04 className="text-red-500" />
                </IconButton>
              </div>
            ))}
          <Button
            variant="ghost"
            size="small"
            className="capitalize w-fit"
            type="button"
            onClick={() => addFieldSize("sizeId")}
          >
            Add Size Variant
          </Button>
        </div>

        {/* Dimension Section */}
        <div className="flex flex-col w-fit">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="keyattributes"
          >
            Add Dimension Variants
          </Typography>
          {formik.values.variantsDimension
            .filter((variant) => variant.dimension)
            .map((variant, index) => (
              <div key={variant.id} className="flex mb-4 space-x-2">
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
                    name={`variantsDimension[${index}].price`}
                    value={variant.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variantsDimension?.[index]?.price &&
                      Boolean(formik.errors.variantsDimension?.[index]?.price)
                    }
                    helperText={
                      formik.touched.variantsDimension?.[index]?.price &&
                      formik.errors.variantsDimension?.[index]?.price
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
                    name={`variantsDimension[${index}].stock`}
                    value={variant.stock}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variantsDimension?.[index]?.stock &&
                      Boolean(formik.errors.variantsDimension?.[index]?.stock)
                    }
                    helperText={
                      formik.touched.variantsDimension?.[index]?.stock &&
                      formik.errors.variantsDimension?.[index]?.stock
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
                    name={`variantsDimension[${index}].dimension`}
                    value={variant.dimension}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </div>
                <IconButton onClick={() => removeFieldd(variant.id)}>
                  <Trash04 className="text-red-500" />
                </IconButton>
              </div>
            ))}
          <Button
            variant="ghost"
            size="small"
            className="capitalize w-fit"
            type="button"
            onClick={() => addFieldDimension("dimension")}
          >
            Add Dimension Variant
          </Button>
        </div>

        {/* Weight Section */}
        <div className="flex flex-col w-fit">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="keyattributes"
          >
            Add Weight Variants
          </Typography>
          {formik.values.variantsWeight
            .filter((variant: any) => variant.weight)
            .map((variant: any, index: any) => (
              <div key={variant.id} className="flex mb-4 space-x-2">
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
                    name={`variantsWeight[${index}].price`}
                    value={variant.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variantsWeight?.[index]?.price &&
                      Boolean(formik.errors.variantsWeight?.[index]?.price)
                    }
                    helperText={
                      formik.touched.variantsWeight?.[index]?.price &&
                      formik.errors.variantsWeight?.[index]?.price
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
                    name={`variantsWeight[${index}].stock`}
                    value={variant.stock}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.variantsWeight?.[index]?.stock &&
                      Boolean(formik.errors.variantsWeight?.[index]?.stock)
                    }
                    helperText={
                      formik.touched.variantsWeight?.[index]?.stock &&
                      formik.errors.variantsWeight?.[index]?.stock
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
                    name={`variantsWeight[${index}].weight`}
                    value={variant.weight}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </div>
                <IconButton onClick={() => removeFieldw(variant.id)}>
                  <Trash04 className="text-red-500" />
                </IconButton>
              </div>
            ))}
          <Button
            variant="ghost"
            size="small"
            className="capitalize w-fit"
            type="button"
            onClick={() => addFieldWeight("weight")}
          >
            Add Weight Variant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;
