import { FC, useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { ApiColorStoreSlice } from "@/api/ApiColorStoreSlice";
import { ApiSizeStoreSlice } from "@/api/ApiSizeStoreSlice";
import { ApiCategoryStoreSlice } from "@/api/ApiCategoryStoreSlice";
// import { useDropzone } from "react-dropzone";
import ProductImageUploader from "./ProductImageUploader";
import ProductVideoUploader from "./ProductVideoUploader";
import ProductSingleImageUploader from "./ProductSingleImageUploader";
import { formatMedias } from "@/utils/fileUtils";
import ProductSpecification from "./ProductSpecification";
import { formatKeyValuePair } from "@/utils/ObjectUtils";
import ProductKeyattribute from "./ProductKeyattribute";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import { ApiProductStoreSlice } from "@/api/ApiProductStoreSlice";
import { useNavigate } from "react-router-dom";
import {
  TextFieldLoading,
  TextFieldError,
  TextFieldEmpty,
} from "@/common/TextFieldStateComponents/TextFieldStateComponents";
import { routeEnum } from "@/constants/RouteConstants";
import BackButton from "@/common/BackButton";
import SportygalaxyLoadingIndicator from "@/common/Loading/SportygalaxyLoadingIndicator";
import { LoadingButton } from "@mui/lab";
import useToggle from "@/hooks/useToggle";
import DropdownIcon from "@/common/SVG/DropdownIcon";
import ProductVariants from "./ProductVariants";
// import { routeEnum } from "@/constants/RouteConstants";

type TCategories = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: Date | null;
  subcategories: [
    {
      id: string | number;
      name: string;
      description: null;
      categoryId: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: Date | null;
    }
  ];
};

type TSubcategories = {
  id: string | number;
  name: string;
  description: null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: Date | null;
};

const validationSchema = Yup.object({
  displayImage: Yup.string().optional(),
  completeVideo: Yup.string().optional(),
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  salesPrice: Yup.number().positive("Sales Price must be positive"),
  stock: Yup.number()
    .required("Stock is required")
    .integer("Stock must be an integer"),
  categoryId: Yup.string().required("Category is required"),
  subcategoryId: Yup.string().required("Subcategory is required"),
  sizeIds: Yup.array().min(1, "Select at least one size"),
  colorIds: Yup.array().min(1, "Select at least one color"),
  specification: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required("Key is required"),
      value: Yup.string().required("Value is required"),
    })
  ),
  keyattribute: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required("Key is required"),
      value: Yup.string().required("Value is required"),
    })
  ),
});

interface ProductCreateProps {}
const ProductCreate: FC<ProductCreateProps> = () => {
  const navigate = useNavigate();
  const { showSuccessSnackbar, showErrorSnackbar } = useExtendedSnackbar();
  const [categoryId, setCategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  const [isSizeIdDropdown, toggleIsSizeIdDropdown, setToggleIsSizeIdDropdown] =
    useToggle(false);

  const [
    isColorIdDropdown,
    toggleIsColorIdDropdown,
    setToggleIsColorIdDropdown,
  ] = useToggle(false);

  const [
    isCategoryIdDropdown,
    toggleIsCategoryIdDropdown,
    setToggleIsCategoryIdDropdown,
  ] = useToggle(false);

  const [
    isSubcategoryIdDropdown,
    toggleIsSubcategoryIdDropdown,
    setToggleIsSubcategoryIdDropdown,
  ] = useToggle(false);

  const {
    data: colorsResponse,
    isLoading: colorIsLoading,
    isError: colorIsError,
    refetch: colorRefetch,
    error: colorError,
  } = ApiColorStoreSlice.useGetColorsQuery();

  const {
    data: sizesResponse,
    isLoading: sizeIsLoading,
    isError: sizeIsError,
    refetch: sizeRefetch,
    error: sizeError,
  } = ApiSizeStoreSlice.useGetSizesQuery();

  const {
    data: categorysResponse,
    isLoading: categoryIsLoading,
    isError: categoryIsError,
    refetch: categoryRefetch,
    error: categoryError,
  } = ApiCategoryStoreSlice.useGetCategorysQuery();

  const [createProduct, createProductResult] =
    ApiProductStoreSlice.useCreateProductMutation();
  useEffect(() => {
    // Get the subcategories from the selected category
    const selectedCategory = categorysResponse?.data?.find(
      (category: TCategories) => category.id === categoryId
    );
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
  }, [categoryId, categorysResponse]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      salesPrice: "",
      stock: "",
      categoryId: "",
      subcategoryId: "",
      sizeIds: [],
      colorIds: [],
      displayImage: "",
      completeVideo: "",
      medias: [],
      specification: [{ key: "", value: "" }],
      keyattribute: [{ key: "", value: "" }],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const input = {
          displayImage: values.displayImage,
          completeVideo: values.completeVideo,
          medias: values.medias,
        };

        const formattedMediaArray = formatMedias(input);
        const formattedSpecificationArray = formatKeyValuePair(
          values.specification
        );
        const formattedKeyattributeArray = formatKeyValuePair(
          values.keyattribute
        );

        const payload = {
          name: values.name,
          description: values.description,
          price: values.price,
          salesPrice: values.salesPrice,
          stock: Number(values.stock) || null,
          categoryId: values.categoryId,
          subcategoryId: values.subcategoryId,
          sizeIds: values.sizeIds,
          colorIds: values.colorIds,
          displayImage: values.displayImage,
          medias: formattedMediaArray,
          specification: formattedSpecificationArray,
          keyattribute: formattedKeyattributeArray,
        };

        // Handle submission to backend
        const data = await createProduct({
          ...payload,
        }).unwrap();

        showSuccessSnackbar(data?.message || "Successful");
        navigate(routeEnum.PRODUCTS);
      } catch (error: any) {
        showErrorSnackbar(error?.data?.error || "Error occured");
      }
    },
  });

  //Error Handling
  if (categoryError) {
    showErrorSnackbar(categoryError?.message || "Error occured");
  }
  if (sizeError) {
    showErrorSnackbar(sizeError?.message || "Error occured");
  }
  if (colorError) {
    showErrorSnackbar(colorError?.message || "Error occured");
  }

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: (acceptedFiles: any) => {
  //     console.log("acceptedFiles ::", acceptedFiles);
  //     // handle file upload logic with Uploadthing here
  //   },
  // });

  const isLoading = colorIsLoading || categoryIsLoading || sizeIsLoading;

  if (isLoading) {
    return <SportygalaxyLoadingIndicator />;
  }

  return (
    <div className="container-wrapper py-[30px] h-[calc(100vh-118.5px)]">
      <div className="flex items-center justify-between">
        <div>
          <BackButton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ProductSingleImageUploader formik={formik} />
        <ProductImageUploader formik={formik} />
        <ProductVideoUploader formik={formik} />
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 md:gap-8"
      >
        {/* <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop the display image here, or click to select files</p>
        </div> */}

        <div className="flex flex-col col-span-2 space-y-1 md:col-span-1">
          <Typography
            color="grey.500"
            component="label"
            className="text-sm font-medium font-inter"
            htmlFor="completeVideo"
          >
            Paste Link to youTube video here
          </Typography>
          <TextField
            className="capitalize MuiTextFieldOutlined--plain"
            placeholder="https://www.youtube.com/watch?v=6qg7UHgkq-U"
            id="completeVideo"
            name="completeVideo"
            size="small"
            value={formik.values.completeVideo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.completeVideo &&
              Boolean(formik.errors.completeVideo)
            }
            helperText={
              formik.touched.completeVideo && formik.errors.completeVideo
            }
            fullWidth
            margin="normal"
          />
        </div>

        <div className="flex flex-col col-span-2 space-y-1 md:col-span-1">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="productName"
          >
            <span className="text-[#D92D20] text-sm font-medium font-inter">
              *
            </span>
            Product Name
          </Typography>
          <TextField
            className="capitalize MuiTextFieldOutlined--plain"
            placeholder="Enter product name here"
            name="name"
            id="productName"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
            margin="normal"
          />
        </div>

        <div className="flex flex-col col-span-2 space-y-1">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="description"
          >
            Product Description
          </Typography>
          <TextField
            className="capitalize MuiTextFieldOutlined--plain"
            placeholder="Enter product description here"
            name="description"
            id="description"
            multiline
            rows={6}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
            margin="normal"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="price"
          >
            <span className="text-[#D92D20] text-sm font-medium font-inter">
              *
            </span>
            Product Price
          </Typography>
          <TextField
            className="capitalize MuiTextFieldOutlined--plain"
            placeholder="Enter product price here"
            name="price"
            id="price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            fullWidth
            margin="normal"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="salesPrice"
          >
            <span className="text-[#D92D20] text-sm font-medium font-inter hidden">
              *
            </span>
            Product Sales Price
          </Typography>
          <TextField
            className="capitalize MuiTextFieldOutlined--plain"
            placeholder="Enter product salesPrice here"
            name="salesPrice"
            id="salesPrice"
            type="number"
            value={formik.values.salesPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.salesPrice && Boolean(formik.errors.salesPrice)
            }
            helperText={formik.touched.salesPrice && formik.errors.salesPrice}
            fullWidth
            margin="normal"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="stock"
          >
            Stock Count
          </Typography>
          <TextField
            className="capitalize MuiTextFieldOutlined--plain"
            placeholder="Enter stock count"
            id="stock"
            name="stock"
            type="number"
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.stock && Boolean(formik.errors.stock)}
            helperText={formik.touched.stock && formik.errors.stock}
            fullWidth
            margin="normal"
          />
        </div>

        <div className="flex flex-col col-span-2 space-y-1 md:col-span-1">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="categoryId"
          >
            <span className="text-[#D92D20] text-sm font-medium font-inter">
              *
            </span>
            Category Id
          </Typography>
          <FormControl fullWidth margin="normal">
            <Select
              displayEmpty
              className="text-sm capitalize MuiTextFieldOutlined--plain font-inter"
              id="categoryId"
              name="categoryId"
              value={formik.values.categoryId}
              onChange={(e) => {
                formik.handleChange(e);
                setCategoryId(e.target.value); // Set selected categoryId
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.categoryId && Boolean(formik.errors.categoryId)
              }
              IconComponent={() => (
                <div className="p-2">
                  <DropdownIcon
                    toggle={toggleIsCategoryIdDropdown}
                    isOpen={isCategoryIdDropdown}
                  />
                </div>
              )}
              open={isCategoryIdDropdown}
              onOpen={() => setToggleIsCategoryIdDropdown(true)}
              onClose={() => setToggleIsCategoryIdDropdown(false)}
              renderValue={(selected) => {
                if (selected === "") {
                  return (
                    <span className="text-sm font-medium text-gray-400 normal-case">
                      Choose category
                    </span>
                  );
                }
                const selectedCategory = categorysResponse?.data?.find(
                  (category: TCategories) => category.id === selected
                );
                return selectedCategory ? selectedCategory.name : "";
              }}
            >
              {categoryIsLoading ? (
                <MenuItem disabled>
                  <TextFieldLoading />
                </MenuItem>
              ) : categoryIsError ? (
                <MenuItem disabled>
                  <TextFieldError refetch={categoryRefetch} />
                </MenuItem>
              ) : categorysResponse?.data?.length === 0 ? (
                <MenuItem disabled>
                  <TextFieldEmpty />
                </MenuItem>
              ) : (
                categorysResponse?.data?.map((category: TCategories) => (
                  <MenuItem
                    className="text-sm capitalize font-inter"
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </div>

        {categoryId && (
          <div className="flex flex-col col-span-2 space-y-1 md:col-span-1">
            <Typography
              color="grey.700"
              component="label"
              className="text-sm font-medium capitalize font-inter"
              htmlFor="subcategoryId"
            >
              <span className="text-[#D92D20] text-sm font-medium font-inter">
                *
              </span>
              Sub Category Id
            </Typography>
            <FormControl fullWidth margin="normal">
              <Select
                displayEmpty
                className="text-sm capitalize MuiTextFieldOutlined--plain font-inter"
                id="subcategoryId"
                name="subcategoryId"
                value={formik.values.subcategoryId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.subcategoryId &&
                  Boolean(formik.errors.subcategoryId)
                }
                IconComponent={() => (
                  <div className="p-2">
                    <DropdownIcon
                      toggle={toggleIsSubcategoryIdDropdown}
                      isOpen={isSubcategoryIdDropdown}
                    />
                  </div>
                )}
                open={isSubcategoryIdDropdown}
                onOpen={() => setToggleIsSubcategoryIdDropdown(true)}
                onClose={() => setToggleIsSubcategoryIdDropdown(false)}
                renderValue={(selected): any => {
                  if (selected === "") {
                    return (
                      <span className="text-sm font-medium text-gray-400 normal-case">
                        Choose sub category
                      </span>
                    );
                  }

                  // Use `reduce` to find the matching subcategory name
                  const selectedCategoryName = subcategories?.reduce(
                    (acc, category: TSubcategories) => {
                      if (String(category?.id) === String(selected)) {
                        acc = category?.name;
                      }
                      return acc;
                    },
                    ""
                  );

                  return selectedCategoryName || "Choose sub category";
                }}
              >
                {subcategories?.map((subcategory: TSubcategories) => (
                  <MenuItem key={subcategory?.id} value={subcategory?.id}>
                    {subcategory?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        <div className="flex flex-col col-span-2 space-y-1 md:col-span-1">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="sizeIds"
          >
            Sizes
          </Typography>
          <FormControl fullWidth margin="normal">
            <Select
              displayEmpty
              className="text-sm capitalize MuiTextFieldOutlined--plain font-inter"
              id="sizeIds"
              multiple
              name="sizeIds"
              value={formik.values.sizeIds}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.sizeIds && Boolean(formik.errors.sizeIds)}
              IconComponent={() => (
                <div className="p-2">
                  <DropdownIcon
                    toggle={toggleIsSizeIdDropdown}
                    isOpen={isSizeIdDropdown}
                  />
                </div>
              )}
              open={isSizeIdDropdown}
              onOpen={() => setToggleIsSizeIdDropdown(true)}
              onClose={() => setToggleIsSizeIdDropdown(false)}
              renderValue={(selected) => {
                // Handle placeholder when nothing is selected
                if (selected.length === 0) {
                  return (
                    <span className="text-sm font-medium text-gray-400 normal-case">
                      Choose sizes
                    </span>
                  );
                }

                // Map selected sizes and join them into a string
                return sizesResponse?.data
                  ?.filter((size: { id: string }) =>
                    (selected as string[]).includes(size.id)
                  )
                  .map((size: any) => size.name)
                  .join(", ");
              }}
            >
              {sizeIsLoading ? (
                <MenuItem disabled>
                  <TextFieldLoading />
                </MenuItem>
              ) : sizeIsError ? (
                <MenuItem disabled>
                  <TextFieldError refetch={sizeRefetch} />
                </MenuItem>
              ) : sizesResponse?.data?.length === 0 ? (
                <MenuItem disabled>
                  <TextFieldEmpty />
                </MenuItem>
              ) : (
                sizesResponse?.data?.map(
                  (size: { id: string; name: string }) => (
                    <MenuItem
                      className="flex gap-1"
                      key={size?.id}
                      value={size?.id}
                    >
                      <Checkbox
                        size="small"
                        checked={
                          (formik.values.sizeIds as string[]).indexOf(
                            size?.id
                          ) > -1
                        }
                      />
                      <ListItemText
                        className="text-xs capitalize font-inter"
                        primary={size?.name}
                      />
                    </MenuItem>
                  )
                )
              )}
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col col-span-2 space-y-1 md:col-span-1">
          <Typography
            color="grey.700"
            component="label"
            className="text-sm font-medium capitalize font-inter"
            htmlFor="sizeIds"
          >
            Colors
          </Typography>
          <FormControl fullWidth margin="normal">
            <Select
              displayEmpty
              className="text-sm capitalize MuiTextFieldOutlined--plain font-inter"
              id="colorIds"
              multiple
              name="colorIds"
              value={formik.values.colorIds}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.colorIds && Boolean(formik.errors.colorIds)}
              IconComponent={() => (
                <div className="p-2">
                  <DropdownIcon
                    toggle={toggleIsColorIdDropdown}
                    isOpen={isColorIdDropdown}
                  />
                </div>
              )}
              open={isColorIdDropdown}
              onOpen={() => setToggleIsColorIdDropdown(true)}
              onClose={() => setToggleIsColorIdDropdown(false)}
              renderValue={(selected) => {
                // Handle placeholder when nothing is selected
                if (selected.length === 0) {
                  return (
                    <span className="text-sm font-medium text-gray-400 normal-case">
                      Choose colors
                    </span>
                  );
                }

                // Map selected colors and join them into a string
                return colorsResponse?.data
                  ?.filter((color: { id: string }) =>
                    (selected as string[]).includes(color.id)
                  )
                  .map((color: any) => color.name)
                  .join(", ");
              }}
            >
              {colorIsLoading ? (
                <MenuItem disabled>
                  <TextFieldLoading />
                </MenuItem>
              ) : colorIsError ? (
                <MenuItem disabled>
                  <TextFieldError refetch={colorRefetch} />
                </MenuItem>
              ) : colorsResponse?.data?.length === 0 ? (
                <MenuItem disabled>
                  <TextFieldEmpty />
                </MenuItem>
              ) : (
                colorsResponse?.data?.map(
                  (color: { id: string; name: string }) => (
                    <MenuItem
                      className="flex gap-1"
                      key={color?.id}
                      value={color?.id}
                    >
                      <Checkbox
                        size="small"
                        checked={
                          (formik.values.colorIds as string[]).indexOf(
                            color?.id
                          ) > -1
                        }
                      />
                      <ListItemText
                        className="text-xs capitalize font-inter"
                        primary={color?.name}
                      />
                    </MenuItem>
                  )
                )
              )}
            </Select>
          </FormControl>
        </div>

        <div className="flex flex-col col-span-2 gap-4">
          <ProductSpecification formik={formik} />
          <ProductKeyattribute formik={formik} />
          <ProductVariants />
        </div>

        <div className="pt-4 pb-6 w-fit">
          <LoadingButton
            disabled={isLoading}
            type="submit"
            className="font-medium capitalize font-inter"
            variant="contained"
            loading={createProductResult.isLoading}
            color="primary"
            fullWidth
          >
            Create
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
