import mongoose, { model, Model, Schema } from 'mongoose';
import userValidationSchema from '../schemas/user.schema';
import { UserDTO } from '../dto/UserDTO';
import { SoftDeleteDocument, softDeletePlugin } from '../utils/softPlugin';

export enum Permission {
  User,
  Moderator,
  Admin,
}

export interface IUser extends SoftDeleteDocument {
  name: string;
  email: string;
  password: string;
  permissions: Permission[];
}

export interface UserModel extends Model<IUser> {
  findByUid(uid: number): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    permissions: {
      type: [Number],
      enum: Object.values(Permission),
      default: [Permission.User]
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(softDeletePlugin);

userSchema.index({ email: 1, active: 1 }, { unique: true }); // Use createIndexes instead of ensureIndex

const User: UserModel = model<IUser, UserModel>('User', userSchema);

export default User;
