import bcryptjs from 'bcryptjs'
import { Document, Model, model, Schema } from 'mongoose'

/**
 * Hash the user's password
 *
 * @param {string} The password to be hashed
 * @returns {string} The hashed password
 */
export async function hashPassword (password: string): Promise<string> {
  const salt: string = await bcryptjs.genSalt(12)
  const newPass: string = await bcryptjs.hash(password, salt)
  return newPass
}

export interface UserInterface {
  name: {
    firstName: string;
    lastName: string;
  };
  username: string;
  email: string;
  password: string;
  createdDate: Date;
}

interface UserDocument extends UserInterface, Document { }

export const UserSchema: Schema = new Schema({
  name: {
    type: {
      firstName: String,
      lastName: String
    },
    required: [true, 'Please inform your name']
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Please inform your username']
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (v: string) => {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
      }
    },
    required: [true, 'Please inform your email']
  },
  password: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})
  // Configures which properties are included when converting MongoDB to JSON object which are returned in API responses.
  .set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id
      delete ret.hash
    }
  })

UserSchema.methods.getTableName = function () {
  return 'users'
}

// Note that pre and post save() hooks are *not* executed on update(), findOneAndUpdate(), etc.
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) { return next() }
  this.password = await hashPassword(this.password)
})

export const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema)
