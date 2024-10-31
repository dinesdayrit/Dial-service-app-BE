import mongoose, { InferSchemaType } from "mongoose";

const serviceItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export type MenuItemType = InferSchemaType<typeof serviceItemSchema>;

const serviceProviderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceProviderName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  serviceSector: [{ type: String, required: true }],
  serviceItems: [serviceItemSchema],
  imageUrl: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
});

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);
export default ServiceProvider;
