import { ApiProductStoreSlice } from "@/api/ApiProductStoreSlice";
import BackButton from "@/common/BackButton";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import SportygalaxyLoadingIndicator from "@/common/Loading/SportygalaxyLoadingIndicator";
import WatermarkOverlay from "@/common/WatermarkOverlay";
import { routeEnum } from "@/constants/RouteConstants";
import { formatCurrency } from "@/utils/currencyUtils";
import { calculateTimeAgo, transformDate } from "@/utils/dateUtils";
import { objectToArray } from "@/utils/ObjectUtils";
import { Button, Chip, Divider, Typography } from "@mui/material";
import {
  Calendar,
  Edit01,
  Grid01,
  Image03,
  LayersThree01,
  Package,
  Tag01,
} from "@untitled-ui/icons-react";
import { FC, type ReactNode, useMemo } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import ProductDeactivateButton from "./components/ProductDeactivateButton";
import ProductImageViewer from "./components/ProductImageViewer";
import ProductReactivateButton from "./components/ProductReactivateButton";
import { cleanAndGroupVariantsV2 } from "./utils/clean-array";

interface ProductDetailProps {}

const toAmount = (value: unknown) => {
  const parsedValue = Number(value || 0);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const displayValue = (value: unknown, fallback = "N/A") => {
  if (value === 0) {
    return "0";
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

const SummaryCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) => (
  <div className="rounded-[24px] border border-[#EAECF0] bg-white p-5 shadow-sm">
    <Typography color="grey.500" className="text-xs font-semibold uppercase tracking-[0.08em] font-inter">
      {label}
    </Typography>
    <Typography color="grey.900" className="mt-3 font-crimson text-3xl font-bold">
      {value}
    </Typography>
    {helper ? (
      <Typography color="grey.600" className="mt-2 text-sm font-inter">
        {helper}
      </Typography>
    ) : null}
  </div>
);

const SectionCard = ({
  icon,
  title,
  description,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <section className="rounded-[28px] border border-[#EAECF0] bg-white p-6 shadow-sm lg:p-7">
    <div className="mb-6 flex items-start gap-3">
      {icon ? (
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101828] text-white">
          {icon}
        </div>
      ) : null}
      <div>
        <Typography color="grey.900" className="font-crimson text-2xl font-bold">
          {title}
        </Typography>
        <Typography color="grey.600" className="mt-1 text-sm font-inter">
          {description}
        </Typography>
      </div>
    </div>
    {children}
  </section>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <div className="flex items-start justify-between gap-5 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-4">
    <Typography color="grey.600" className="text-sm font-medium font-inter">
      {label}
    </Typography>
    <Typography color="grey.900" className="text-right text-sm font-semibold font-inter">
      {value}
    </Typography>
  </div>
);

const InfoPill = ({ label }: { label: string }) => (
  <Chip
    label={label}
    variant="outlined"
    className="!rounded-full !border-[#D0D5DD] !bg-white !font-semibold !font-inter"
  />
);

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

  const name = productInfoResponse?.name || "";
  const displayImage = productInfoResponse?.displayImage || "";
  const description = productInfoResponse?.description || "";
  const price = toAmount(productInfoResponse?.price);
  const salesPrice =
    toAmount(productInfoResponse?.salesPrice) > 0
      ? toAmount(productInfoResponse?.salesPrice)
      : price;
  const priceSavings = Math.max(price - salesPrice, 0);
  const priceSavingsPercent =
    price > 0 ? Math.round((priceSavings / price) * 100) : 0;
  const modelNumber = productInfoResponse?.modelNumber || "";
  const stock = toAmount(productInfoResponse?.stock);
  const category = productInfoResponse?.category?.name || "";
  const subcategory = productInfoResponse?.subcategory?.name || "";
  const isDeleted = Boolean(productInfoResponse?.isDeleted);
  const createdAt = productInfoResponse?.createdAt || "";
  const updatedAt = productInfoResponse?.updatedAt || "";

  const colors = productInfoResponse?.colors || [];
  const sizes = productInfoResponse?.sizes || [];
  const types = productInfoResponse?.types || [];
  const medias = productInfoResponse?.medias || [];
  const specification = productInfoResponse?.specification || [];
  const keyattribute = productInfoResponse?.keyattribute || [];
  const variants = cleanAndGroupVariantsV2(productInfoResponse?.variants) || [];

  const mediaStats = useMemo(() => {
    const imageBuckets = medias.filter((media: any) => media?.type === "image");
    const videoBuckets = medias.filter((media: any) => media?.type === "video");
    const galleryImageCount = imageBuckets.reduce(
      (total: number, media: any) => total + (media?.images?.length || 0),
      0
    );
    const introVideoCount = videoBuckets.filter(
      (media: any) => media?.links?.introVideo
    ).length;
    const completeVideoCount = videoBuckets.filter(
      (media: any) => media?.links?.completeVideo
    ).length;

    return {
      galleryImageCount,
      introVideoCount,
      completeVideoCount,
    };
  }, [medias]);

  const handleGotoUpdateProduct = () => {
    const route = generatePath(routeEnum.PRODUCTS_UPDATE, {
      id,
    });
    navigate(route);
  };

  const canManageProduct = Boolean(
    id &&
      !getProductInfoQuery.isFetching &&
      !getProductInfoQuery.isLoading
  );

  const variantStats = useMemo(() => {
    const totalVariantStock = variants.reduce(
      (sum: number, variant: any) => sum + toAmount(variant?.stock),
      0
    );
    const minVariantPrice = variants.length
      ? Math.min(...variants.map((variant: any) => toAmount(variant?.price)))
      : 0;
    const maxVariantPrice = variants.length
      ? Math.max(...variants.map((variant: any) => toAmount(variant?.price)))
      : 0;

    return {
      totalVariantStock,
      minVariantPrice,
      maxVariantPrice,
    };
  }, [variants]);

  return (
    <>
      <WatermarkOverlay isVisible={isDeleted} text="Product Deactivated" />

      <div className="container-wrapper py-[30px]">
        <div className="space-y-5">
          <BackButton />

          <section className="overflow-hidden rounded-[32px] border border-[#101828] bg-white shadow-sm">
            <div className="bg-[#101828] px-6 py-8 text-white lg:px-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div>
                    <Typography className="font-inter text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
                      Product catalog record
                    </Typography>
                    <Typography className="mt-2 font-crimson text-4xl font-bold text-white capitalize">
                      {displayValue(name, "Unnamed product")}
                    </Typography>
                    <Typography className="mt-2 text-sm font-inter text-white/80">
                      Production-ready overview of pricing, merchandising groups,
                      inventory, and catalog assets.
                    </Typography>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Chip
                      label={modelNumber ? `Model ${modelNumber}` : "Model unavailable"}
                      className="!border !border-white/10 !bg-white/10 !font-semibold !font-inter !text-white"
                      variant="outlined"
                    />
                    {category ? (
                      <Chip
                        label={category}
                        className="!border !border-white/10 !bg-white/10 !font-semibold !font-inter !text-white"
                        variant="outlined"
                      />
                    ) : null}
                    {subcategory ? (
                      <Chip
                        label={subcategory}
                        className="!border !border-white/10 !bg-white/10 !font-semibold !font-inter !text-white"
                        variant="outlined"
                      />
                    ) : null}
                    <Chip
                      label={isDeleted ? "Deactivated" : "Active"}
                      className="!border !border-white/10 !bg-white/10 !font-semibold !font-inter !text-white"
                      variant="outlined"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Typography className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 font-inter">
                      Base price
                    </Typography>
                    <Typography className="mt-2 text-base font-semibold text-white font-inter">
                      {formatCurrency(price)}
                    </Typography>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Typography className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 font-inter">
                      Sales price
                    </Typography>
                    <Typography className="mt-2 text-base font-semibold text-white font-inter">
                      {formatCurrency(salesPrice)}
                    </Typography>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:col-span-2">
                    <Typography className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 font-inter">
                      Inventory snapshot
                    </Typography>
                    <Typography className="mt-2 text-base font-semibold text-white font-inter">
                      {stock} unit{stock === 1 ? "" : "s"} in primary stock
                    </Typography>
                    <Typography className="mt-1 text-sm text-white/75 font-inter">
                      {createdAt ? `Created ${calculateTimeAgo(createdAt)}` : "No creation timestamp"}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 bg-[#F8FAFC] px-6 py-6 md:grid-cols-2 xl:grid-cols-4 lg:px-8">
              <SummaryCard
                label="Base Price"
                value={formatCurrency(price)}
                helper="Primary list price for the product."
              />
              <SummaryCard
                label="Sales Price"
                value={formatCurrency(salesPrice)}
                helper="Current discounted selling price."
              />
              <SummaryCard
                label="Discount"
                value={
                  priceSavings > 0
                    ? `${formatCurrency(priceSavings)}`
                    : "₦0.00"
                }
                helper={
                  priceSavingsPercent > 0
                    ? `${priceSavingsPercent}% below base price`
                    : "No active discount"
                }
              />
              <SummaryCard
                label="Stock"
                value={`${stock}`}
                helper="Primary stock value saved on the product record."
              />
            </div>
          </section>
        </div>

        <LoadingContent
          loading={getProductInfoQuery.isLoading}
          error={getProductInfoQuery.isError}
          onReload={getProductInfoQuery.refetch}
          loadingContent={<SportygalaxyLoadingIndicator />}
          data={objectToArray(productInfoResponse)}
        >
          <div className="mt-10 space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
              <SectionCard
                icon={<Image03 width={20} height={20} />}
                title="Media Gallery"
                description="Primary catalog imagery and video assets attached to this product."
              >
                <ProductImageViewer
                  displayImage={displayImage}
                  medias={medias}
                  isLoading={getProductInfoQuery.isLoading}
                  isError={getProductInfoQuery.isError}
                  errorMessage={(getProductInfoQuery.error as any)?.message}
                />
              </SectionCard>

              <SectionCard
                icon={<Tag01 width={20} height={20} />}
                title="Commercial Snapshot"
                description="Core merchandising, category placement, and lifecycle information."
              >
                <div className="space-y-3">
                  <DetailRow label="Product Name" value={displayValue(name)} />
                  <DetailRow label="Model Number" value={displayValue(modelNumber)} />
                  <DetailRow label="Category" value={displayValue(category)} />
                  <DetailRow label="Subcategory" value={displayValue(subcategory)} />
                  <DetailRow label="Base Price" value={formatCurrency(price)} />
                  <DetailRow label="Sales Price" value={formatCurrency(salesPrice)} />
                  <DetailRow
                    label="Discount Value"
                    value={
                      priceSavings > 0
                        ? `${formatCurrency(priceSavings)} (${priceSavingsPercent}%)`
                        : "No discount"
                    }
                  />
                  <DetailRow
                    label="Record Status"
                    value={isDeleted ? "Deactivated" : "Active"}
                  />
                  <DetailRow
                    label="Created On"
                    value={createdAt ? transformDate(createdAt) : "N/A"}
                  />
                  <DetailRow
                    label="Last Updated"
                    value={updatedAt ? transformDate(updatedAt) : "N/A"}
                  />
                </div>
              </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
              <SectionCard
                icon={<Package width={20} height={20} />}
                title="Description"
                description="Merchandising copy currently attached to this product."
              >
                <div className="rounded-[24px] border border-[#EAECF0] bg-[#FCFCFD] p-5">
                  <Typography color="grey.700" className="text-sm font-inter leading-7">
                    {displayValue(description, "No product description has been provided yet.")}
                  </Typography>
                </div>
              </SectionCard>

              <SectionCard
                icon={<Calendar width={20} height={20} />}
                title="Catalog Metrics"
                description="Quick counts for assets, variants, and merchandising options."
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <DetailRow label="Primary Stock" value={`${stock} units`} />
                  <DetailRow
                    label="Variant Count"
                    value={`${variants.length} variant${variants.length === 1 ? "" : "s"}`}
                  />
                  <DetailRow
                    label="Color Options"
                    value={`${colors.length} option${colors.length === 1 ? "" : "s"}`}
                  />
                  <DetailRow
                    label="Size Options"
                    value={`${sizes.length} option${sizes.length === 1 ? "" : "s"}`}
                  />
                  <DetailRow
                    label="Type Options"
                    value={`${types.length} option${types.length === 1 ? "" : "s"}`}
                  />
                  <DetailRow
                    label="Gallery Images"
                    value={`${mediaStats.galleryImageCount}`}
                  />
                  <DetailRow
                    label="Intro Videos"
                    value={`${mediaStats.introVideoCount}`}
                  />
                  <DetailRow
                    label="Complete Videos"
                    value={`${mediaStats.completeVideoCount}`}
                  />
                </div>
              </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
              <SectionCard
                icon={<LayersThree01 width={20} height={20} />}
                title="Merchandising Groups"
                description="Assigned option groups that define how the product can be merchandised."
              >
                <div className="space-y-5">
                  <div>
                    <Typography color="grey.900" className="font-inter text-sm font-semibold">
                      Colors
                    </Typography>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {colors.length ? (
                        colors.map((color: any, index: number) => (
                          <div
                            key={`${color?.id || color?.colorId || index}`}
                            className="flex items-center gap-2 rounded-full border border-[#D0D5DD] bg-[#FCFCFD] px-3 py-2"
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-[#D0D5DD]"
                              style={{ backgroundColor: color?.color?.name || "#FFFFFF" }}
                            ></span>
                            <Typography color="grey.700" className="text-sm font-medium font-inter">
                              {displayValue(color?.color?.name)}
                            </Typography>
                          </div>
                        ))
                      ) : (
                        <Typography color="grey.600" className="text-sm font-inter">
                          No color options assigned.
                        </Typography>
                      )}
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <Typography color="grey.900" className="font-inter text-sm font-semibold">
                      Sizes
                    </Typography>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sizes.length ? (
                        sizes.map((size: any, index: number) => (
                          <InfoPill
                            key={`${size?.id || size?.sizeId || index}`}
                            label={`Size ${displayValue(size?.size?.name)}`}
                          />
                        ))
                      ) : (
                        <Typography color="grey.600" className="text-sm font-inter">
                          No size options assigned.
                        </Typography>
                      )}
                    </div>
                  </div>

                  {types.length ? (
                    <>
                      <Divider />
                      <div>
                        <Typography color="grey.900" className="font-inter text-sm font-semibold">
                          Types
                        </Typography>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {types.map((type: any, index: number) => (
                            <InfoPill
                              key={`${type?.id || index}`}
                              label={displayValue(type?.name || type?.type || type)}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </SectionCard>

              <SectionCard
                icon={<Grid01 width={20} height={20} />}
                title="Variant Pricing"
                description="Variant-level inventory and pricing currently configured for this product."
              >
                {variants.length ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-3">
                      <DetailRow
                        label="Variant Count"
                        value={`${variants.length}`}
                      />
                      <DetailRow
                        label="Min Variant Price"
                        value={formatCurrency(variantStats.minVariantPrice)}
                      />
                      <DetailRow
                        label="Total Variant Stock"
                        value={`${variantStats.totalVariantStock}`}
                      />
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {variants.map((variant: any, index: number) => {
                        const variantLabels = [
                          variant?.color ? `Color: ${variant.color}` : null,
                          variant?.size ? `Size: ${variant.size}` : null,
                          variant?.weight ? `Weight: ${variant.weight}` : null,
                          variant?.dimension ? `Dimension: ${variant.dimension}` : null,
                        ].filter((label): label is string => Boolean(label));

                        return (
                          <div
                            key={variant?.id || index}
                            className="rounded-[24px] border border-[#EAECF0] bg-[#FCFCFD] p-5"
                          >
                            <Typography color="grey.900" className="font-crimson text-xl font-bold">
                              Variant {index + 1}
                            </Typography>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {variantLabels.length ? (
                                variantLabels.map((label) => (
                                  <InfoPill key={label} label={label} />
                                ))
                              ) : (
                                <InfoPill label="Base variant" />
                              )}
                            </div>

                            <div className="mt-4 grid gap-3">
                              <DetailRow
                                label="Price"
                                value={formatCurrency(toAmount(variant?.price))}
                              />
                              <DetailRow
                                label="Stock"
                                value={`${toAmount(variant?.stock)} units`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="rounded-[24px] border border-[#EAECF0] bg-[#FCFCFD] p-5">
                    <Typography color="grey.600" className="text-sm font-inter">
                      No variants are configured for this product.
                    </Typography>
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
              <SectionCard
                icon={<Tag01 width={20} height={20} />}
                title="Specifications"
                description="Structured specification data displayed to customers and admins."
              >
                {specification.length ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {specification.flatMap((item: Record<string, any>, rowIndex: number) =>
                      Object.entries(item).map(([key, value]) => (
                        <DetailRow
                          key={`${key}-${rowIndex}`}
                          label={key}
                          value={displayValue(value)}
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-[#EAECF0] bg-[#FCFCFD] p-5">
                    <Typography color="grey.600" className="text-sm font-inter">
                      No specifications recorded for this product.
                    </Typography>
                  </div>
                )}
              </SectionCard>

              <SectionCard
                icon={<Tag01 width={20} height={20} />}
                title="Key Attributes"
                description="Additional feature highlights and catalog-facing attribute data."
              >
                {keyattribute.length ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {keyattribute.flatMap((item: Record<string, any>, rowIndex: number) =>
                      Object.entries(item).map(([key, value]) => (
                        <DetailRow
                          key={`${key}-${rowIndex}`}
                          label={key}
                          value={displayValue(value)}
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-[#EAECF0] bg-[#FCFCFD] p-5">
                    <Typography color="grey.600" className="text-sm font-inter">
                      No key attributes recorded for this product.
                    </Typography>
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-[#EAECF0] bg-white p-5 shadow-sm">
              {isDeleted ? (
                <ProductReactivateButton disable={canManageProduct} productId={id} />
              ) : (
                <>
                  <Button
                    disabled={!canManageProduct}
                    onClick={handleGotoUpdateProduct}
                    startIcon={<Edit01 width={20} height={20} />}
                    className="text-base font-semibold capitalize font-inter md:px-10"
                    variant="ghost"
                    size="medium"
                  >
                    Edit
                  </Button>

                  <ProductDeactivateButton
                    disable={!canManageProduct}
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
