import { comparePassword, hashPassword } from '@/utils/crypto'
import { InferSchemaType, model, Schema } from 'mongoose'

const DOCUMENT_NAME = 'user'
const COLLECTION_NAME = 'users'

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      default: null
    },
    password: {
      type: String,
      required: true
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'role'
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false
  }
)

export type User = InferSchemaType<typeof UserSchema> & {
  comparePassword: (password: string) => Promise<boolean>
}

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await hashPassword(this.password)
  return next()
})

UserSchema.methods.comparePassword = async function (password: string) {
  return await comparePassword(password, this.password)
}

export default model<User>(DOCUMENT_NAME, UserSchema)
