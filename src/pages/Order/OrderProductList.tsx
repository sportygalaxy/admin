import { routeEnum } from "@/constants/RouteConstants";
import { formatCurrency } from "@/utils/currencyUtils";
import { Button, Card, CardContent, CardMedia, Chip, Divider, Typography } from "@mui/material";
import { ArrowRight, Package } from "@untitled-ui/icons-react";
import { generatePath, useNavigate } from "react-router-dom";

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

const OrderProductList = ({ items }: { items: any[] }) => {
  const navigate = useNavigate();
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section className="rounded-[28px] border border-[#EAECF0] bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <Typography color="grey.900" className="font-crimson text-3xl font-bold">
            Ordered Products
          </Typography>
          <Typography color="grey.600" className="mt-1 text-sm font-inter">
            Line-item pricing, quantities, and merchandising details for this order.
          </Typography>
        </div>

        <Chip
          icon={<Package width={16} height={16} />}
          label={`${safeItems.length} line item${safeItems.length === 1 ? "" : "s"}`}
          variant="outlined"
          className="!w-fit !rounded-full !border-[#D0D5DD] !bg-[#F9FAFB] !font-semibold !font-inter"
        />
      </div>

      <div className="mt-6 space-y-4">
        {safeItems.map((item: any, index: number) => {
          const { product, quantity } = item || {};
          const displayImage = product?.displayImage || "";
          const name = product?.name || "Unnamed Product";
          const productId = product?.id || "";
          const productModelNumber = product?.modelNumber || "N/A";
          const regularUnitPrice = toAmount(product?.price);
          const promotionalUnitPrice =
            toAmount(product?.salesPrice) > 0
              ? toAmount(product?.salesPrice)
              : regularUnitPrice;
          const lineRegularTotal = regularUnitPrice * toAmount(quantity);
          const linePromotionalTotal = promotionalUnitPrice * toAmount(quantity);
          const lineSavings = Math.max(lineRegularTotal - linePromotionalTotal, 0);

          const gotoDetailedProduct = () => {
            if (!productId) {
              return;
            }

            const route = generatePath(routeEnum.PRODUCT_DETAILS, {
              id: productId,
            });
            navigate(route);
          };

          return (
            <Card
              key={item?.id || `${productId}-${index}`}
              className="overflow-hidden rounded-[24px] border border-[#EAECF0] !shadow-none"
            >
              <div className="grid gap-0 lg:grid-cols-[220px,1fr]">
                <div className="bg-[#F8FAFC] p-4 lg:p-5">
                  <CardMedia
                    component="img"
                    image={displayImage}
                    alt={name}
                    className="h-[220px] w-full rounded-[20px] object-cover bg-white"
                  />
                </div>

                <CardContent className="flex flex-col gap-5 p-5 lg:p-6">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div>
                        <Typography
                          color="grey.900"
                          className="font-crimson text-2xl font-bold capitalize"
                        >
                          {name}
                        </Typography>
                        <Typography color="grey.600" className="mt-1 text-sm font-inter">
                          Model Number: {productModelNumber}
                        </Typography>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Chip
                          label={`Qty ${displayValue(quantity, "0")}`}
                          variant="outlined"
                          className="!border-[#D0D5DD] !bg-white !font-semibold !font-inter"
                        />
                        <Chip
                          label={`Size: ${displayValue(item?.size)}`}
                          variant="outlined"
                          className="!border-[#D0D5DD] !bg-white !font-semibold !font-inter"
                        />
                        <Chip
                          label={`Color: ${displayValue(item?.color)}`}
                          variant="outlined"
                          className="!border-[#D0D5DD] !bg-white !font-semibold !font-inter"
                        />
                        <Chip
                          label={lineSavings > 0 ? "Discounted" : "Standard Pricing"}
                          color={lineSavings > 0 ? "success" : "default"}
                          variant="outlined"
                          className="!font-semibold !font-inter"
                        />
                      </div>
                    </div>

                    <Button
                      variant="outlined"
                      endIcon={<ArrowRight width={16} height={16} />}
                      className="!w-fit !capitalize !font-semibold !font-inter"
                      onClick={gotoDetailedProduct}
                      disabled={!productId}
                    >
                      View Product
                    </Button>
                  </div>

                  <Divider />

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-4">
                      <Typography color="grey.500" className="text-xs font-semibold uppercase tracking-[0.08em] font-inter">
                        Real Unit Price
                      </Typography>
                      <Typography color="grey.900" className="mt-2 text-sm font-semibold font-inter">
                        {formatCurrency(regularUnitPrice)}
                      </Typography>
                    </div>

                    <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-4">
                      <Typography color="grey.500" className="text-xs font-semibold uppercase tracking-[0.08em] font-inter">
                        Sales Unit Price
                      </Typography>
                      <Typography color="grey.900" className="mt-2 text-sm font-semibold font-inter">
                        {formatCurrency(promotionalUnitPrice)}
                      </Typography>
                    </div>

                    <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-4">
                      <Typography color="grey.500" className="text-xs font-semibold uppercase tracking-[0.08em] font-inter">
                        Real Line Total
                      </Typography>
                      <Typography color="grey.900" className="mt-2 text-sm font-semibold font-inter">
                        {formatCurrency(lineRegularTotal)}
                      </Typography>
                    </div>

                    <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-4">
                      <Typography color="grey.500" className="text-xs font-semibold uppercase tracking-[0.08em] font-inter">
                        Sales Line Total
                      </Typography>
                      <Typography color="grey.900" className="mt-2 text-sm font-semibold font-inter">
                        {formatCurrency(linePromotionalTotal)}
                      </Typography>
                      {lineSavings > 0 ? (
                        <Typography color="success.main" className="mt-1 text-xs font-semibold font-inter">
                          Saving {formatCurrency(lineSavings)}
                        </Typography>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default OrderProductList;
