import { ApiProductStoreSlice } from "@/api/ApiProductStoreSlice";
import BackButton from "@/common/BackButton";
import { formatCurrency } from "@/utils/currencyUtils";
import { Typography, Button } from "@mui/material";
import { Edit01 } from "@untitled-ui/icons-react";
import { FC } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import ProductImageViewer from "./components/ProductImageViewer";
import SportygalaxyLoadingIndicator from "@/common/Loading/SportygalaxyLoadingIndicator";
import ProductDynamicKeyValuePairTable from "./components/ProductDynamicKeyValuePairTable";
import { routeEnum } from "@/constants/RouteConstants";
import ProductDeactivateButton from "./components/ProductDeactivateButton";
import WatermarkOverlay from "@/common/WatermarkOverlay";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import { objectToArray } from "@/utils/ObjectUtils";
import ProductReactivateButton from "./components/ProductReactivateButton";
import { cleanAndGroupVariantsV2 } from "./utils/clean-array";
import ProductDynamicKeyValueTio from "./components/ProductDynamicKeyValueTio";

interface ProductDetailProps {}
const ProductDetail: FC<ProductDetailProps> = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>() as { id: string };
  const getProductInfoQuery = ApiProductStoreSlice.useGetProductInfoQuery(
    {
      id,
    },
    { skip: !id }
  );
  const productInfoResponse = getProductInfoQuery?.data?.data;

  // const id = productInfoResponse?.id || "";
  const name = productInfoResponse?.name || "";
  const displayImage = productInfoResponse?.displayImage || "";
  const description = productInfoResponse?.description || "";
  const price = productInfoResponse?.price || "";
  const modelNumber = productInfoResponse?.modelNumber || "";
  const stock = productInfoResponse?.stock || 0;
  const category = productInfoResponse?.category?.name || "";
  const subcategory = productInfoResponse?.subcategory?.name || "";
  const isDeleted = productInfoResponse?.isDeleted;

  const colors = productInfoResponse?.colors || [];
  const sizes = productInfoResponse?.sizes || [];

  const medias = productInfoResponse?.medias || [];

  const specification = productInfoResponse?.specification || [
    { key: "", value: "" },
  ];
  const keyattribute = productInfoResponse?.keyattribute || [
    { key: "", value: "" },
  ];
  const variants = cleanAndGroupVariantsV2(productInfoResponse?.variants) || [];

  const handleGotoUpdateProduct = () => {
    const route = generatePath(routeEnum.PRODUCTS_UPDATE, {
      id,
    });
    navigate(route);
  };

  const isDisabled = !(
    !id ||
    isDeleted ||
    getProductInfoQuery.isFetching ||
    getProductInfoQuery.isLoading
  );

  return (
    <>
      <WatermarkOverlay isVisible={isDeleted} text="Product Deactivated" />

      <div className="container-wrapper py-[30px]">
        <div className="flex items-center justify-between">
          <div>
            <BackButton />
          </div>
        </div>

        <div className="flex items-center justify-between mt-7">
          <Typography
            color="grey.900"
            className="text-4xl font-bold font-crimson"
          >
            Product Details - ({modelNumber})
          </Typography>
        </div>

        <LoadingContent
          loading={getProductInfoQuery.isLoading}
          error={getProductInfoQuery.isError}
          onReload={getProductInfoQuery.refetch}
          loadingContent={<SportygalaxyLoadingIndicator />}
          // errorContent={<TableError onReload={() => refetch()} />}
          // emptyContent={</>}
          data={objectToArray(productInfoResponse)}
        >
          <div className="mt-10 space-y-10">
            <ProductImageViewer
              displayImage={displayImage}
              medias={medias}
              isLoading={getProductInfoQuery.isLoading}
              isError={getProductInfoQuery.isError}
              errorMessage={getProductInfoQuery.error?.message}
            />

            <div className="space-y-4">
              <p className="font-bold text-black capitalize font-jost text-mobile-2xl md:text-2xl">
                {name || ""}
              </p>
              <p className="font-light leading-normal tracking-wide font-jost text-secondary text-mobile-xl md:text-xl">
                {description || ""}
              </p>

              <div className="mt-8">
                <p className="font-bold text-black font-jost text-mobile-2xl md:text-2xl">
                  Groups
                </p>

                <div className="mt-2 space-y-6">
                  {modelNumber && (
                    <div className="space-y-3">
                      <p className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Model Number:{" "}
                        <span className="font-semibold">{modelNumber}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-2 space-y-6">
                  {category && (
                    <div className="space-y-3">
                      <p className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Category: {category}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-2 space-y-6">
                  {subcategory && (
                    <div className="space-y-3">
                      <p className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Subcategory: {subcategory}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <p className="font-bold text-black font-jost text-mobile-2xl md:text-2xl">
                  Variations
                </p>

                <div className="mt-2 space-y-6">
                  {colors && (
                    <div className="space-y-3">
                      <p className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Total options: {colors?.length} colour
                        {colors?.length >= 2 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {colors.map((color: any, index: number) => (
                          <span
                            key={index}
                            className="rounded-full h-fit w-fit"
                          >
                            <Button
                              type="button"
                              style={{ backgroundColor: color?.color?.name }}
                              className={`w-10 h-10 rounded-full ${
                                !!color?.color?.name
                                  ? "border-1 border-green-400"
                                  : ""
                              }`}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sizes && (
                    <div className="space-y-3">
                      <p className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Total options: {sizes?.length} size
                        {sizes?.length >= 2 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {sizes.map((size: any, index: number) => (
                          <Button
                            key={index}
                            type="button"
                            className={`rounded-none ${
                              !!size?.size?.name
                                ? "border-1 border-green-400"
                                : ""
                            }`}
                          >
                            {size?.size?.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <p className="font-medium text-mobile-5xl md:text-4xl">
                  {formatCurrency(price || 0)}
                  <span className="pl-2 text-sm text-destructive">
                    *{stock} unit{stock > 1 ? "s" : ""} left
                  </span>
                </p>
              </div>
            </div>

            <ProductDynamicKeyValuePairTable
              title="Specifications"
              data={specification}
            />

            <ProductDynamicKeyValuePairTable
              title="Keyattributes"
              data={keyattribute}
            />

            <ProductDynamicKeyValueTio title="Variants" data={variants} />

            <div className="mt-10 space-x-3">
              {isDeleted ? (
                <ProductReactivateButton disable={!isDisabled} productId={id} />
              ) : (
                <>
                  <Button
                    disabled={!isDisabled}
                    onClick={handleGotoUpdateProduct}
                    startIcon={<Edit01 width={20} height={20} />}
                    className="text-base font-semibold capitalize font-inter md:px-10"
                    variant="ghost"
                    size="medium"
                  >
                    Edit
                  </Button>

                  <ProductDeactivateButton
                    disable={!isDisabled}
                    productId={id}
                  />
                </>
              )}
            </div>
          </div>
        </LoadingContent>
      </div>
    </>
  );
};

export default ProductDetail;
