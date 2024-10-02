const mongoose = require("mongoose");
const { Schema } = mongoose;
// const slugify  = require("slugify");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tagList: {
      type: [String],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      default: '',
    },
    favoritedBy: [{
      type : Schema.Types.ObjectId,
      ref: "User",
    }], 
    favoritesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
console.log("just befor pre save");

// articleSchema.pre("save", async function (next) {
//     console.log("Pre-save hook triggered");
//     console.log("current title",this.title)
//     if (!this.title) {
//         console.error("Title is missing, cannot generate slug.");
//         return next(new Error("Title is required for slug generation."));
//       }
//   if (this.isModified("title")) {
//     let slug = slugify(this.title, { lower: true , strict: true});
//     let existingSlug = await this.constructor.findOne({ slug });

//     let counter = 1;
//     let newSlug = slug;
//     while (existingSlug) {
//       newSlug = `${slug}-${counter++}`;
//       existingSlug = await this.constructor.findOne({ slug: newSlug });
//     }
//     this.slug = newSlug;
//     console.log("Generated slug: ", newSlug);
//   }
//   next();
// });

const Article = mongoose.model("articleinfos", articleSchema);

module.exports = {
  Article,
};
