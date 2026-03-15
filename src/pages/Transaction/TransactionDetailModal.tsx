import { ApiTransactionStoreSlice } from "@/api/ApiTransactionStoreSlice";
import SportygalaxyLoadingIndicator from "@/common/Loading/SportygalaxyLoadingIndicator";
import TransactionStatus from "@/common/TransactionStatus";
import { routeEnum } from "@/constants/RouteConstants";
import { formatCurrency } from "@/utils/currencyUtils";
import { transformDate } from "@/utils/dateUtils";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { FC, Fragment } from "react";
import { Link as RouterLink, generatePath } from "react-router-dom";

interface TransactionDetailModalProps {
  open: boolean;
  transactionId?: string | null;
  onClose: () => void;
}

const TransactionDetailModal: FC<TransactionDetailModalProps> = ({
  open,
  transactionId,
  onClose,
}) => {
  const { data, isLoading, isError, refetch } =
    ApiTransactionStoreSlice.useGetTransactionInfoQuery(
      { id: transactionId || "" },
      { skip: !open || !transactionId }
    );

  const transaction = data?.data;
  const orderRoute = transaction?.orderId
    ? generatePath(routeEnum.ORDER_DETAILS, {
        id: transaction.orderId,
      })
    : "";

  const formatAmount = (amount: number, currency?: string) => {
    if (currency && currency !== "NGN") {
      return `${currency} ${Number(amount || 0).toFixed(2)}`;
    }

    return formatCurrency(amount || 0);
  };

  const renderRow = (label: string, value: any) => (
    <div className="flex items-start justify-between gap-6 py-3">
      <Typography className="font-inter text-sm font-medium text-[#667085] min-w-[140px]">
        {label}
      </Typography>
      <Typography className="font-inter text-sm font-semibold text-[#101828] text-right break-all">
        {value || "N/A"}
      </Typography>
    </div>
  );

  const renderJsonBlock = (title: string, value: any) => {
    if (!value || (typeof value === "object" && !Object.keys(value).length)) {
      return null;
    }

    return (
      <div className="space-y-3">
        <Typography className="font-crimson text-xl font-bold text-[#101828]">
          {title}
        </Typography>
        <Box className="rounded-xl border border-[#EAECF0] bg-[#F9FAFB] p-4">
          <pre className="whitespace-pre-wrap break-words text-xs font-mono text-[#344054]">
            {JSON.stringify(value, null, 2)}
          </pre>
        </Box>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle className="font-crimson text-3xl font-bold text-[#101828]">
        Transaction Details
      </DialogTitle>

      <DialogContent dividers className="space-y-8">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <SportygalaxyLoadingIndicator />
          </div>
        ) : isError ? (
          <div className="py-10 space-y-4 text-center">
            <Typography className="font-inter text-base text-[#475467]">
              Unable to load transaction details.
            </Typography>
            <Button variant="outlined" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : !transaction ? (
          <div className="py-10 text-center">
            <Typography className="font-inter text-base text-[#475467]">
              No transaction details found.
            </Typography>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Typography className="font-crimson text-2xl font-bold text-[#101828]">
                  {transaction.id}
                </Typography>
                <TransactionStatus status={transaction.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {transaction.paymentOption ? (
                  <Chip
                    label={transaction.paymentOption}
                    className="font-semibold font-inter"
                    variant="outlined"
                  />
                ) : null}
                {transaction.paymentGateway?.name ? (
                  <Chip
                    label={transaction.paymentGateway.name}
                    className="font-semibold capitalize font-inter"
                    variant="outlined"
                  />
                ) : null}
                {transaction.orderId ? (
                  <Chip
                    label={`Order linked`}
                    className="font-semibold font-inter"
                    color="success"
                    variant="outlined"
                  />
                ) : null}
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-1">
                <Typography className="font-crimson text-xl font-bold text-[#101828]">
                  Transaction
                </Typography>
                {renderRow(
                  "Amount",
                  formatAmount(transaction.amount, transaction.currency)
                )}
                {renderRow("Currency", transaction.currency)}
                {renderRow("Conversion Rate", transaction.conversionRate)}
                {renderRow("Backend Ref", transaction.reference)}
                {renderRow("Gateway Ref", transaction.gatewayReference)}
                {renderRow(
                  "Verified At",
                  transaction.verifiedAt
                    ? transformDate(transaction.verifiedAt)
                    : "N/A"
                )}
                {renderRow("Created", transformDate(transaction.createdAt))}
                {renderRow("Updated", transformDate(transaction.updatedAt))}
              </div>

              <div className="space-y-1">
                <Typography className="font-crimson text-xl font-bold text-[#101828]">
                  Customer
                </Typography>
                {renderRow("Name", transaction.customerName)}
                {renderRow("Email", transaction.customerEmail)}
                {renderRow("Phone", transaction.customerPhone)}
                {renderRow("Address", transaction.customerAddress)}
                {renderRow("User Id", transaction.userId)}
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-1">
                <Typography className="font-crimson text-xl font-bold text-[#101828]">
                  Order Link
                </Typography>
                {renderRow("Order Id", transaction.orderId)}
                {renderRow(
                  "Order Created",
                  transaction.orderCreated ? "Yes" : "No"
                )}
                {renderRow("Creation Error", transaction.orderCreationError)}
                {renderRow(
                  "Payment Plan",
                  transaction.linkedOrder?.paymentOption ||
                    transaction.paymentOption
                )}
                {renderRow(
                  "Order Total",
                  transaction.linkedOrder
                    ? formatAmount(
                        Number(transaction.linkedOrder.total || 0) +
                          Number(transaction.linkedOrder.shippingFee || 0),
                        transaction.currency
                      )
                    : "N/A"
                )}
                {renderRow(
                  "Amount Paid",
                  transaction.linkedOrder
                    ? formatAmount(
                        transaction.linkedOrder.amountPaid || 0,
                        transaction.currency
                      )
                    : "N/A"
                )}
                {renderRow(
                  "Balance",
                  transaction.linkedOrder
                    ? formatAmount(
                        transaction.linkedOrder.amountToPay || 0,
                        transaction.currency
                      )
                    : "N/A"
                )}
              </div>

              <div className="space-y-1">
                <Typography className="font-crimson text-xl font-bold text-[#101828]">
                  Linked Order Items
                </Typography>
                {transaction.linkedOrder?.items?.length ? (
                  <div className="space-y-3">
                    {transaction.linkedOrder.items.map((item: any) => (
                      <Fragment key={item.id}>
                        <div className="rounded-xl border border-[#EAECF0] p-4">
                          <Typography className="font-inter text-sm font-semibold text-[#101828]">
                            {item.product?.name || item.productId}
                          </Typography>
                          <Typography className="mt-1 font-inter text-xs text-[#667085]">
                            SKU: {item.product?.modelNumber || "N/A"}
                          </Typography>
                          <Typography className="mt-1 font-inter text-xs text-[#667085]">
                            Qty: {item.quantity} | Size: {item.size || "N/A"} |
                            Color: {item.color || "N/A"}
                          </Typography>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <Typography className="font-inter text-sm text-[#667085]">
                    No linked order items.
                  </Typography>
                )}
              </div>
            </div>

            {renderJsonBlock("Metadata", transaction.metadata)}
            {renderJsonBlock("Order Payload", transaction.orderPayload)}
            {renderJsonBlock("Verification Log", transaction.verificationLog)}
            {renderJsonBlock("Transaction Log", transaction.transactionLog)}
          </>
        )}
      </DialogContent>

      <DialogActions className="px-6 pb-5">
        {transaction?.orderId ? (
          <Button
            component={RouterLink}
            to={orderRoute}
            variant="outlined"
            onClick={onClose}
            className="capitalize"
          >
            Open Linked Order
          </Button>
        ) : null}
        <Button className="capitalize" variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailModal;
