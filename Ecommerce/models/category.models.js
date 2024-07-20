import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [32, "Name must be less than 32 characters long"],
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
