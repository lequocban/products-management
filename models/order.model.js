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
    status: {
      type: String,
      default: "pending",
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
    updatedBy: [
      {
        account_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        updatedAt: Date,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
