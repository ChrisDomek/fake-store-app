export const getCategories = async () => {
  const response = await fetch("https://fakestoreapi.com/products/categories");
  return await response.json();
};

export const getProductsByCategory = async (category) => {
  const response = await fetch(
    `https://fakestoreapi.com/products/category/${category}`
  );
  return await response.json();
};

export const getProductDetails = async (id) => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  return await response.json();
};
