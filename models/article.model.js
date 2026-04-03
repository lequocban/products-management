const { default: mongoose } = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const articleSchema = new mongoose.Schema(
  {
    title: String,
    article_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleCategory",
      default: "",
    },
    content: String,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
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
const Article = mongoose.model("Article", articleSchema, "articles");

module.exports = Article;
