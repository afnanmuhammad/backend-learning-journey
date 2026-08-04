import mongoose from "mongoose";
import { baseSchemaPlugin } from "../plugins/baseSchema.plugin.js";



const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});


categorySchema.plugin(baseSchemaPlugin);

const Category = mongoose.model("Category", categorySchema);

export { Category };