export const baseSchemaPlugin = (schema) => {
  schema.virtual("id").get(function () {
    return this._id.toHexString();
  });

  schema.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    },
  });
};