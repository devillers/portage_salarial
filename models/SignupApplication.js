import mongoose from 'mongoose';

const FileMetadataSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    size: { type: Number, default: 0 },
    type: { type: String, default: '' },
    lastModified: { type: Number, default: null }
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    streetNumber: { type: String, default: '' },
    streetName: { type: String, default: '' },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    photos: { type: [FileMetadataSchema], default: [] }
  },
  { _id: false }
);

const OwnerDetailsSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    birthDate: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  { _id: false }
);

const OwnerApplicationSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    slug: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    heroPhoto: { type: [FileMetadataSchema], default: [] },
    gallery: { type: [FileMetadataSchema], default: [] },
    rooms: { type: [RoomSchema], default: [] },
    propertyAddress: { type: AddressSchema, default: () => ({}) },
    mainAddress: { type: AddressSchema, default: () => ({}) },
    owner: { type: OwnerDetailsSchema, default: () => ({}) },
    identityDocument: { type: [FileMetadataSchema], default: [] },
    ownershipProof: { type: [FileMetadataSchema], default: [] }
  },
  { _id: false }
);

const TenantApplicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    preferredRegion: { type: String, default: '' },
    desiredDates: { type: String, default: '' },
    guests: { type: String, default: '' },
    budget: { type: String, default: '' },
    requirements: { type: String, default: '' }
  },
  { _id: false }
);

const SignupApplicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['owner', 'tenant'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed'],
      default: 'pending'
    },
    ownerData: {
      type: OwnerApplicationSchema,
      required: function () {
        return this.type === 'owner';
      }
    },
    tenantData: {
      type: TenantApplicationSchema,
      required: function () {
        return this.type === 'tenant';
      }
    }
  },
  { timestamps: true }
);

export default mongoose.models.SignupApplication || mongoose.model('SignupApplication', SignupApplicationSchema);
