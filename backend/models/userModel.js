import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Bundle from './bundleModel.js';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    coins: {
      type: Number,
      default: 0,
    },
    myLeaderBoard: {
      type: Number,
      default: 0,
    },
    bundles: [
      {
        bundleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Bundle',
          required: true,
        },
        dateSubscribed: {
          type: Date,
          default: Date.now,
        },
        timesSubscribed: {
          type: Number,
          default: 0,
        },
        totalCoins: {
          type: Number,
          default: 0,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ['fellow', 'general'],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
