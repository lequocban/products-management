const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    user_info: {
      fullName: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        discountPercentage: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
