import { routeEnum } from "@/constants/RouteConstants";
import { formatCurrency } from "@/utils/currencyUtils";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";

const OrderProductList = ({ items }: { items: any }) => {
  const navigate = useNavigate();
  return (
    <>
      <p className="font-bold text-black font-jost text-mobile-2xl md:text-2xl">
        Products
      </p>

      <div className="grid grid-cols-1 mt-2 md:grid-cols-3">
        {items.map((item: any) => {
          const { product, price, quantity } = item;
          const displayImage = product?.displayImage || "";
          const name = product?.name || "Unnamed Product";
          const productId = product?.id || "";
          const productModelNumber = product?.modelNumber || "";

          const gotoDetailedProduct = () => {
            const route = generatePath(routeEnum.PRODUCT_DETAILS, {
              id: productId,
            });
            return navigate(route);
          };

          return (
            <div className="flex flex-col gap-2" key={item.id}>
              <Card
                onClick={gotoDetailedProduct}
                className="rounded-lg shadow-none hover:border-1 hover:cursor-pointer"
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={displayImage}
                  alt={name}
                  className="object-cover p-4"
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    className="font-bold leading-normal tracking-wide text-black font-crimson text-mobile-xl md:text-xl"
                  >
                    {name}
                  </Typography>
                  <Typography className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-lg">
                    Model Number: {productModelNumber}
                  </Typography>
                  <Typography className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-lg">
                    Price: {formatCurrency(price || 0)}
                  </Typography>
                  <Typography className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-lg">
                    Quantity: {quantity}
                  </Typography>
                  {/* 
                  <Typography className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-lg">
                    Color: {color || "N/A"}
                  </Typography>
                  <Typography className="font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-lg">
                    Size: {size || "N/A"}
                  </Typography> */}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OrderProductList;
