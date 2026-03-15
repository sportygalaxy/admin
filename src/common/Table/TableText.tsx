import { FC } from "react";
import { Avatar, Typography, Chip, AvatarGroup } from "@mui/material";
import { Calendar } from "@untitled-ui/icons-react";
import { TABLE_ROW_TYPE } from "@/constants/enums";
import { formatCurrency } from "@/utils/currencyUtils";
import { transformDate } from "@/utils/dateUtils";
import OrderStatus from "../OrderStatus";
import { calculateCartTotals } from "@/pages/Order/order.helper";
import TransactionStatus from "../TransactionStatus";

interface TableTextProps {
  type: string;
  value?: any;
}
const TableText: FC<TableTextProps> = ({ type, value }) => {
  if (type === TABLE_ROW_TYPE.STATUS) {
    return (
      <>
        {value?.isVerified ? (
          <Chip
            color="success"
            className="text-xs font-medium font-inter"
            icon={<span className="w-2 h-2 rounded-full bg-[#1BA879]"></span>}
            label="Active"
          />
        ) : (
          <Chip
            color="error"
            icon={<span className="w-2 h-2 rounded-full bg-[#F04438]"></span>}
            label="Inactive"
          />
        )}
      </>
    );
  }

  if (type === TABLE_ROW_TYPE.CLIENT_ACCOUNT_DELETED) {
    return (
      <>
        {value?.isDeleted ? (
          <Chip
            color="success"
            className="text-xs font-medium font-inter"
            icon={<span className="w-2 h-2 rounded-full bg-[#1BA879]"></span>}
            label="True"
          />
        ) : (
          <Chip
            color="error"
            icon={<span className="w-2 h-2 rounded-full bg-[#F04438]"></span>}
            label="False"
          />
        )}
      </>
    );
  }

  if (type === TABLE_ROW_TYPE.OFFLINE_ORDER) {
    return (
      <>
        {!value?.user ? (
          <Chip
            color="error"
            icon={<span className="w-2 h-2 rounded-full bg-[#F04438]"></span>}
            label="Ofline"
          />
        ) : (
          <Chip
            color="success"
            className="text-xs font-medium font-inter"
            icon={<span className="w-2 h-2 rounded-full bg-[#1BA879]"></span>}
            label="Online"
          />
        )}
      </>
    );
  }

  if (type === TABLE_ROW_TYPE.PRODUCT_DESCRIPTION) {
    return (
      <Typography
        color="grey.900"
        className="font-inter font-normal max-w-[250px] truncate line-clamp-3 text-wrap text-xs"
      >
        {value?.description}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.REVIEW_DESCRIPTION) {
    return (
      <Typography
        color="grey.900"
        className="font-inter font-normal max-w-[250px] truncate line-clamp-3 text-wrap text-xs"
      >
        {value?.comment}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.PRICE) {
    return (
      <Typography color="grey.900" className="text-sm font-medium font-inter">
        {formatCurrency(value?.price || 0)}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.STOCK) {
    return (
      <Typography color="grey.900" className="text-sm font-medium font-inter">
        {value?.stock}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.CATEGORY) {
    return (
      <Typography color="grey.900" className="text-sm font-medium font-inter">
        {value?.category?.name}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.SUB_CATEGORY) {
    return (
      <Typography color="grey.900" className="text-sm font-medium font-inter">
        {value?.subcategory?.name}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.PRODUCT_NAME) {
    return (
      <div className="flex items-center gap-2">
        <Avatar
          src={value?.displayImage}
          alt={value?.name}
          className="w-20 h-20 rounded-md"
        />
        <div>
          <Typography
            color="grey.900"
            className="font-crimson font-bold text-md max-w-[200px] capitalize"
          >
            {value?.name}
          </Typography>
          <div className="flex items-center space-x-1">
            <Calendar color="#027A48" width={12} height={12} />
            <Typography
              color="grey.600"
              className="text-xs font-thin capitalize font-inter"
            >
              ({transformDate(value?.createdAt)})
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (type === TABLE_ROW_TYPE.REVIEW_NAME) {
    return (
      <div className="flex items-center gap-2">
        <div>
          <Typography
            color="grey.900"
            className="font-crimson font-bold text-md max-w-[200px] capitalize"
          >
            {`${value?.firstName} ${value?.lastName}`}
          </Typography>
          <div className="flex items-center space-x-1">
            <Calendar color="#027A48" width={12} height={12} />
            <Typography
              color="grey.600"
              className="text-xs font-thin capitalize font-inter"
            >
              ({transformDate(value?.createdAt)})
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (type === TABLE_ROW_TYPE.CLIENT_NAME) {
    return (
      <div className="flex items-center gap-2">
        {/* <Avatar
          src={value?.avatar}
          alt={value?.firstName}
          className="w-20 h-20 rounded-md"
        /> */}
        <div>
          <Typography
            color="grey.900"
            className="font-crimson font-bold text-xl max-w-[200px] capitalize"
          >
            {value?.firstName} {value?.lastName}
          </Typography>
          <div className="flex items-center space-x-1">
            <Calendar color="#027A48" width={18} height={18} />
            <Typography
              color="grey.600"
              className="text-xs font-thin capitalize font-inter"
            >
              ({transformDate(value?.createdAt)})
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (type === TABLE_ROW_TYPE.ORDER_PRODUCT_NAME) {
    return (
      <>
        {value?.items?.map((product: any, index: any) => (
          <Typography
            component="span"
            key={`${product?.product?.id}${index}`}
            color="grey.900"
            className="font-crimson font-bold text-sm max-w-[200px] capitalize"
          >
            {product?.product?.name}
            {index < value?.items?.length - 1 && (
              <Typography
                color="error"
                className="text-lg font-bold font-crimson"
              >
                ,
              </Typography>
            )}
          </Typography>
        ))}
      </>
    );
  }

  const renderCustomerName = (user: any) => {
    const firstName =
      user?.user?.firstName || user?.offlineUser?.firstName || "";
    const lastName = user?.user?.lastName || user?.offlineUser?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return (
      <Typography
        component="span"
        color="grey.900"
        className="font-crimson font-bold text-sm max-w-[200px] capitalize"
      >
        {fullName || "No Name Provided"}
      </Typography>
    );
  };

  if (type === TABLE_ROW_TYPE.ORDER_CUSTOMER_NAME) {
    return (
      <>
        <Typography
          component="span"
          color="grey.900"
          className="font-crimson font-bold text-sm max-w-[200px] capitalize"
        >
          {renderCustomerName(value)}
        </Typography>
      </>
    );
  }

  if (type === TABLE_ROW_TYPE.ORDER_NAME) {
    const orderCount = Number(value?.items?.length) || 0;
    return (
      <div className="flex items-center gap-2">
        <AvatarGroup
          className="flex items-center justify-end w-6 h-6"
          total={orderCount}
        >
          {value?.items?.map((product: any, index: number) => {
            return (
              <Avatar
                src={product?.product?.displayImage}
                alt={product?.product.name}
                className="w-10 h-10 rounded-md"
                key={`${product?.product?.id}${index}`}
              />
            );
          })}
        </AvatarGroup>
      </div>
    );
  }

  if (type === TABLE_ROW_TYPE.ORDER_PRICE) {
    return (
      <Typography color="grey.900" className="text-sm font-medium font-inter">
        {formatCurrency(value?.variant?.prices || 0)}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.ORDER_STATUS) {
    return <OrderStatus status={value?.status} />;
  }

  if (type === TABLE_ROW_TYPE.ORDERED_ITEM_COUNT) {
    return (
      <div>
        <Typography
          color="grey.900"
          className="font-crimson font-bold text-md max-w-[200px] capitalize"
        >
          {calculateCartTotals(value?.items).totalItemInCart || 0}
        </Typography>
      </div>
    );
  }

  if (type === TABLE_ROW_TYPE.ORDERED_ITEM_QTY_COUNT) {
    return (
      <div>
        <Typography
          color="grey.900"
          className="font-crimson font-bold text-md max-w-[200px] capitalize"
        >
          {calculateCartTotals(value?.items).totalItemQtyInAllCart || 0}
        </Typography>
      </div>
    );
  }

  if (type === TABLE_ROW_TYPE.TRANSACTION_STATUS) {
    return <TransactionStatus status={value?.status} />;
  }

  if (type === TABLE_ROW_TYPE.TRANSACTION_AMOUNT) {
    return (
      <Typography color="grey.900" className="text-sm font-medium font-inter">
        {formatCurrency(value?.amount || 0)}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.TRANSACTION_MEDIUM) {
    return (
      <Typography
        color="grey.900"
        className="text-sm font-medium capitalize font-inter"
      >
        {value?.paymentGateway?.name}
      </Typography>
    );
  }

  if (type === TABLE_ROW_TYPE.CREATED_AT_DATE) {
    return (
      <div>
        <Typography
          color="grey.900"
          className="font-crimson font-bold text-md max-w-[200px] capitalize"
        >
          {transformDate(value?.createdAt)}
        </Typography>
      </div>
    );
  }

  if (type === TABLE_ROW_TYPE.UPDATED_AT_DATE) {
    return (
      <div>
        <Typography
          color="grey.900"
          className="font-crimson font-bold text-md max-w-[200px] capitalize"
        >
          {transformDate(value?.updatedAt)}
        </Typography>
      </div>
    );
  }

  return <>Nil</>;
};

export default TableText;
