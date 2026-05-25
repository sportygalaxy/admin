import { formatCurrency } from "@/utils/currencyUtils";
import { Divider } from "@mui/material";
import React from "react";

interface ProductDynamicKeyValueTioProps {
  title: string;
  data: Array<{
    id: string;
    price: number;
    stock: number;
    colorId?: string;
    sizeId?: string;
    weight?: number;
    dimension?: string;
    color?: string;
    size?: string;
  }>;
}

const ProductDynamicKeyValueTio: React.FC<ProductDynamicKeyValueTioProps> = ({
  title,
  data,
}) => {
  // Default key mapping for variant fields, can be customized as needed
  const keyMapping: Record<string, string> = {
    colors: "Color",
    colorsPrice: "Color Price",
    sizes: "Size",
    sizesPrice: "Size Price",
    weights: "Weight",
    weightsPrice: "Weight Price",
    dimensions: "Dimension",
    dimensionsPrice: "Dimension Price",
    qty: "Quantity",
    price: "Price",
    salesPrice: "Sales Price",
    prices: "Total Price",
    paymentSplitValue: "Percentage Split Value",
    amountToPay: "Total Amount Paid Price",
  };

const transformedData = data?.map((item) => {
  if (!item) return {}; // Skip undefined or null items

  const keyValuePairs: Record<string, string> = {};
  Object.keys(item)?.forEach((key) => {
    // Exclude `id` property as it's not needed in the key-value pair
    if (key !== "id") {
      // Use custom name if available, else fallback to default (original key)
      const customKey = keyMapping[key] || key;

      // If it's a price-related field, apply currency formatting
      if (customKey.includes("Price") || customKey === "Total Price") {
        keyValuePairs[customKey] = formatCurrency(item[key]);
      } else {
        keyValuePairs[customKey] = item[key] ? item[key].toString() : "";
      }
    }
  });

  return keyValuePairs;
});


  return (
    <div className="mb-6">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="table-mobile-scroll">
        <table className="min-w-full bg-white border-collapse rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
                Title
              </th>
              <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {transformedData?.map((item, rowIndex) => (
              <>
                <div className="py-3">
                  <Divider className="w-2 h-4 text-teal-400 bg-teal-400 " />
                </div>
                {
                  // Display each key-value pair in the row
                  Object.entries(item)?.map(([key, value]) => (
                    <tr key={`${key}-${rowIndex}`} className="border-t">
                      <td className="px-4 py-2 text-gray-600 text-md">{key}</td>
                      <td className="px-4 py-2 text-sm font-bold text-gray-600">
                        {value}
                      </td>
                    </tr>
                  ))
                }
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDynamicKeyValueTio;
