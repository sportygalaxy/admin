import React from "react";

interface ProductDynamicKeyValuePairTableProps {
  title: string;
  data: Record<string, string>[];
}

const ProductDynamicKeyValuePairTable: React.FC<ProductDynamicKeyValuePairTableProps> = ({ title, data }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="table-mobile-scroll">
        <table className="min-w-full bg-white shadow-md rounded-lg border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                Title
              </th>
              <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, rowIndex) =>
              Object.entries(item).map(([key, value]) => (
                <tr key={`${key}-${rowIndex}`} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-600">{key}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{value}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDynamicKeyValuePairTable;
