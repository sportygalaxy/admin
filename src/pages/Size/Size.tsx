import { FC, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@/common/Breadcrum";
import BackButton from "@/common/BackButton";
import { routeEnum } from "@/constants/RouteConstants";
import { Button, Typography } from "@mui/material";
import { PlusCircle } from "@untitled-ui/icons-react";
import SizeTable from "./SizeTable";
import SizeFormDialog from "./SizeFormDialog";
import { SizeItem } from "./SizeTypes";

const Size: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<SizeItem | null>(null);

  const breadcrumbItems: BreadcrumbItem[] = [
    { path: routeEnum.PRODUCTS, label: "Products", disabled: true },
    { path: routeEnum.PRODUCT_SIZES, label: "Sizes" },
  ];

  const handleAddSize = () => {
    setEditingSize(null);
    setIsDialogOpen(true);
  };

  const handleEditSize = (size: SizeItem) => {
    setEditingSize(size);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSize(null);
  };

  return (
    <div className="container-wrapper py-[30px] h-[calc(100vh-118.5px)]">
      <div className="flex items-end justify-between">
        <div className="space-y-5">
          <BackButton />
          <div>
            <Breadcrumb breadcrumbItems={breadcrumbItems} />
            <Typography
              color="grey.900"
              className="text-2xl font-bold font-crimson"
            >
              Sizes
            </Typography>
            <Typography
              color="grey.600"
              className="mt-1 text-sm font-medium font-inter"
            >
              Create, edit, or remove product sizes.
            </Typography>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<PlusCircle width={20} height={20} />}
          className="font-bold capitalize font-inter"
          size="large"
          onClick={handleAddSize}
        >
          Add Size
        </Button>
      </div>

      <div className="mt-10">
        <SizeTable onEdit={handleEditSize} />
      </div>

      <SizeFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        size={editingSize || undefined}
      />
    </div>
  );
};

export default Size;
