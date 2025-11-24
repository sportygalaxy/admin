import { FC, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@/common/Breadcrum";
import BackButton from "@/common/BackButton";
import { routeEnum } from "@/constants/RouteConstants";
import { Button, Typography } from "@mui/material";
import { PlusCircle } from "@untitled-ui/icons-react";
import ColorTable from "./ColorTable";
import ColorFormDialog from "./ColorFormDialog";
import { ColorItem } from "./ColorTypes";

const Color: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<ColorItem | null>(null);

  const breadcrumbItems: BreadcrumbItem[] = [
    { path: routeEnum.PRODUCTS, label: "Products", disabled: true },
    { path: routeEnum.PRODUCT_COLORS, label: "Colors" },
  ];

  const handleAddColor = () => {
    setEditingColor(null);
    setIsDialogOpen(true);
  };

  const handleEditColor = (color: ColorItem) => {
    setEditingColor(color);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingColor(null);
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
              className="font-bold text-2xl font-crimson"
            >
              Colors
            </Typography>
            <Typography
              color="grey.600"
              className="font-medium text-sm font-inter mt-1"
            >
              Create, edit, or remove product colors.
            </Typography>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<PlusCircle width={20} height={20} />}
          className="capitalize font-bold font-inter"
          size="large"
          onClick={handleAddColor}
        >
          Add Color
        </Button>
      </div>

      <div className="mt-10">
        <ColorTable onEdit={handleEditColor} />
      </div>

      <ColorFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        color={editingColor || undefined}
      />
    </div>
  );
};

export default Color;
