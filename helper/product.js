module.exports.priceNewProducts = (products) => {
  products.forEach((item) => {
    item.newPrice = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(2);
  });
  return products;
};

module.exports.priceNewProduct = (product) => {
  const newPrice = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(2);
  return newPrice;
};
