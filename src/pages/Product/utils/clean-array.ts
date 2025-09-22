import { mergeArrays } from "./remove-id-and-merge-array";

export const cleanAndGroupVariants = (variants: Array<any>) => {
  // Arrays to store the cleaned variant types
  const variantsColor: Array<any> = [];
  const variantsSize: Array<any> = [];
  const variantsWeight: Array<any> = [];
  const variantsDimension: Array<any> = [];

  // Iterate over the provided array
  variants.forEach((variant) => {
    // Clean the variant object by removing the 'id' property
    const { ...cleanedVariant } = variant;

    // Group variants based on their properties
    if (cleanedVariant.colorId) {
      variantsColor.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        colorId: cleanedVariant.colorId,
      });
    } else if (cleanedVariant.sizeId) {
      variantsSize.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        sizeId: cleanedVariant.sizeId,
      });
    } else if (cleanedVariant.weight) {
      variantsWeight.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        weight: cleanedVariant.weight,
      });
    } else if (cleanedVariant.dimension) {
      variantsDimension.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        dimension: cleanedVariant.dimension,
      });
    }
  });

  // const result = mergeArrays();

  return {
    variantsColor,
    variantsSize,
    variantsWeight,
    variantsDimension,
  };
};

export const cleanAndGroupVariantsV2 = (variants: Array<any>) => {
  // Arrays to store the cleaned variant types
  const variantsColor: Array<any> = [];
  const variantsSize: Array<any> = [];
  const variantsWeight: Array<any> = [];
  const variantsDimension: Array<any> = [];

  // Iterate over the provided array
  variants?.forEach((variant) => {
    // Clean the variant object by removing the 'id' property
    const { ...cleanedVariant } = variant;

    // Group variants based on their properties
    if (cleanedVariant.colorId) {
      variantsColor.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        colorId: cleanedVariant.colorId,
        color: cleanedVariant.color.name,
      });
    } else if (cleanedVariant.sizeId) {
      variantsSize.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        sizeId: cleanedVariant.sizeId,
        size: cleanedVariant.size.name,
      });
    } else if (cleanedVariant.weight) {
      variantsWeight.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        weight: cleanedVariant.weight,
      });
    } else if (cleanedVariant.dimension) {
      variantsDimension.push({
        id: cleanedVariant.id,
        price: cleanedVariant.price,
        stock: Number(cleanedVariant.stock),
        dimension: cleanedVariant.dimension,
      });
    }
  });

  const result = mergeArrays(
    variantsColor,
    variantsSize,
    variantsWeight,
    variantsDimension
  );

  return result;
};

export const convertPriceAndStockToNumber = (data: Array<any>) => {
  return data.map((item) => ({
    ...item,
    price: typeof item.price === "string" ? Number(item.price) : item.price,
    stock: typeof item.stock === "string" ? Number(item.stock) : item.stock,
  }));
};

// const cleanedVariants = cleanAndGroupVariants(initialVariants);
