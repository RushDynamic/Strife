import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    encodedKeyPair: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      default: `avatars/default/default${Math.floor(
        Math.random() * 22 + 1,
      )}.png`,
    },
  },
  {
    timestamps: true,
  },
);

const Account = new mongoose.model('accounts', accountSchema);
export default Account;
