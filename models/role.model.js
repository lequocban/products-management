const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: [],
    },
    createdBy: {
      account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
);
const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
