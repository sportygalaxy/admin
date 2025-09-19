export const removeIdAndMergeArrays = (...arrays: Array<any[]>): Array<any> => {
  // Flatten all arrays, remove the 'id' property from each object, and return a new array
  return arrays
    .flat() // Flatten the arrays into a single array
    .map(({ id, ...rest }) => rest); // Remove the 'id' and keep the rest of the properties
};
