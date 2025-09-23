import { FC, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  IconButton,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Trash04 } from "@untitled-ui/icons-react";
import { ApiColorStoreSlice } from "@/api/ApiColorStoreSlice";
import { ApiSizeStoreSlice } from "@/api/ApiSizeStoreSlice";
import { cleanAndGroupVariants } from "./utils/clean-array";

interface ProductVariantsProps {
  formik: any;
  initialVariants?: Array<{ title: string; details: string }>;
}

const ProductVariants: FC<ProductVariantsProps> = ({
  formik,
  initialVariants = [],
}) => {
  const cleanedArr = cleanAndGroupVariants(initialVariants);

  // UseEffect to set the form values based on initialVariants prop
  useEffect(() => {
    if (initialVariants.length > 0) {
      const { variantsColor, variantsSize, variantsWeight, variantsDimension } =
        cleanedArr;
      formik.setFieldValue("variantsColor", variantsColor);
      formik.setFieldValue("variantsSize", variantsSize);
      formik.setFieldValue("variantsWeight", variantsWeight);
      formik.setFieldValue("variantsDimension", variantsDimension);
    }
  }, [initialVariants, formik.values.variants]);

  const {
    data: colorsResponse,
    isLoading: colorIsLoading,
    isError: colorIsError,
    refetch: colorRefetch,
  } = ApiColorStoreSlice.useGetColorsQuery();

  const {
    data: sizesResponse,
    isLoading: sizeIsLoading,
    isError: sizeIsError,
    refetch: sizeRefetch,
  } = ApiSizeStoreSlice.useGetSizesQuery();

  // Reusable function to add new fields to the variants arrays
  const addField = (variantType: string, type: string) => {
    const newVariant = {
      id: uuidv4(),
      price: 0,
      stock: 0,
      [type]: "0",
    };
    formik.setFieldValue(variantType, [
      ...formik.values[variantType],
      newVariant,
    ]);
  };

  // Function to remove a specific variant based on id
  const removeField = (variantType: string, id: string) => {
    const updatedVariants = formik.values[variantType].filter(
      (variant: any) => variant.id !== id
    );
    formik.setFieldValue(variantType, updatedVariants);
  };

  // Function to handle the color selection
  const handleSelectChange = (
    variantType: string,
    field: string,
    index: number,
    event: SelectChangeEvent<any>
  ) => {
    const updatedVariants = [...formik.values[variantType]];
    updatedVariants[index][field] = event.target.value;
    formik.setFieldValue(variantType, updatedVariants);
  };

  useEffect(() => {
    colorRefetch();
  }, [colorRefetch]);

  useEffect(() => {
    sizeRefetch();
  }, [sizeRefetch]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full space-y-6">
        {/* Color Section */}
        <div className="flex flex-col space-y-2 w-fit">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="color"
          >
            Add Color Variants
          </Typography>
          {formik.values.variantsColor?.map((variant, index) => (
            <div key={variant.id} className="flex mb-4 space-x-2">
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Price"
                type="number"
                name={`variantsColor[${index}].price`}
                value={variant.price}
                onChange={formik.handleChange}
                fullWidth
              />
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Stock"
                type="number"
                name={`variantsColor[${index}].stock`}
                value={variant.stock}
                onChange={formik.handleChange}
                fullWidth
              />
              <Select
                className="capitalize MuiTextFieldOutlined--plain"
                value={variant.colorId || ""}
                onChange={(e) =>
                  handleSelectChange("variantsColor", "colorId", index, e)
                }
                fullWidth
                disabled={colorIsLoading || colorIsError}
              >
                <MenuItem value="" disabled>
                  Select Color
                </MenuItem>
                {colorsResponse?.data?.map((color) => (
                  <MenuItem key={color.id} value={color.id}>
                    {color.name}
                  </MenuItem>
                ))}
              </Select>
              <IconButton
                onClick={() => removeField("variantsColor", variant.id)}
              >
                <Trash04 className="text-red-500" />
              </IconButton>
            </div>
          ))}
          <Button
            className="capitalize w-fit"
            variant="ghost"
            size="small"
            onClick={() => addField("variantsColor", "colorId")}
          >
            Add Color Variant
          </Button>
        </div>

        {/* Size Section */}
        <div className="flex flex-col space-y-2 w-fit">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="size"
          >
            Add Size Variants
          </Typography>
          {formik.values.variantsSize?.map((variant, index) => (
            <div key={variant.id} className="flex mb-4 space-x-2">
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Price"
                type="number"
                name={`variantsSize[${index}].price`}
                value={variant.price}
                onChange={formik.handleChange}
                fullWidth
              />
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Stock"
                type="number"
                name={`variantsSize[${index}].stock`}
                value={variant.stock}
                onChange={formik.handleChange}
                fullWidth
              />
              <Select
                value={variant.sizeId || ""}
                onChange={(e) =>
                  handleSelectChange("variantsSize", "sizeId", index, e)
                }
                fullWidth
                disabled={sizeIsLoading || sizeIsError}
              >
                <MenuItem value="" disabled>
                  Select Size
                </MenuItem>
                {sizesResponse?.data?.map((size) => (
                  <MenuItem key={size.id} value={size.id}>
                    {size.name}
                  </MenuItem>
                ))}
              </Select>
              <IconButton
                onClick={() => removeField("variantsSize", variant.id)}
              >
                <Trash04 className="text-red-500" />
              </IconButton>
            </div>
          ))}
          <Button
            className="capitalize w-fit"
            variant="ghost"
            size="small"
            onClick={() => addField("variantsSize", "sizeId")}
          >
            Add Size Variant
          </Button>
        </div>

        {/* Dimension Section */}
        <div className="flex flex-col space-y-2 w-fit">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="dimension"
          >
            Add Dimension Variants
          </Typography>
          {formik.values.variantsDimension?.map((variant, index) => (
            <div key={variant.id} className="flex mb-4 space-x-2">
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Price"
                type="number"
                name={`variantsDimension[${index}].price`}
                value={variant.price}
                onChange={formik.handleChange}
                fullWidth
              />
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Stock"
                type="number"
                name={`variantsDimension[${index}].stock`}
                value={variant.stock}
                onChange={formik.handleChange}
                fullWidth
              />
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Dimension (2x2, 2ft, 2inches)"
                name={`variantsDimension[${index}].dimension`}
                value={variant.dimension}
                onChange={formik.handleChange}
                fullWidth
              />
              <IconButton
                onClick={() => removeField("variantsDimension", variant.id)}
              >
                <Trash04 className="text-red-500" />
              </IconButton>
            </div>
          ))}
          <Button
            className="capitalize w-fit"
            variant="ghost"
            size="small"
            onClick={() => addField("variantsDimension", "dimension")}
          >
            Add Dimension Variant
          </Button>
        </div>

        {/* Weight Section */}
        <div className="flex flex-col space-y-2 w-fit">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="weight"
          >
            Add Weight Variants
          </Typography>
          {formik.values.variantsWeight?.map((variant, index) => (
            <div key={variant.id} className="flex mb-4 space-x-2">
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Price"
                type="number"
                name={`variantsWeight[${index}].price`}
                value={variant.price}
                onChange={formik.handleChange}
                fullWidth
              />
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Stock"
                type="number"
                name={`variantsWeight[${index}].stock`}
                value={variant.stock}
                onChange={formik.handleChange}
                fullWidth
              />
              <TextField
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    backgroundColor: "white",
                    px: 1,
                    borderRadius: "6px",
                    color: "#828282",
                    fontSize: "16px",
                    textTransform: "capitalize",
                    border: "0.5px solid #9792E3",
                  },
                }}
                className="capitalize MuiTextFieldOutlined--plain"
                label="Weight (kg, g, lbs)"
                name={`variantsWeight[${index}].weight`}
                value={variant.weight}
                onChange={formik.handleChange}
                fullWidth
              />
              <IconButton
                onClick={() => removeField("variantsWeight", variant.id)}
              >
                <Trash04 className="text-red-500" />
              </IconButton>
            </div>
          ))}
          <Button
            className="capitalize w-fit"
            variant="ghost"
            size="small"
            onClick={() => addField("variantsWeight", "weight")}
          >
            Add Weight Variant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;
