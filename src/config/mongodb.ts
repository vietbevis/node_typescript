import mongoose from 'mongoose'
import envConfig from './env.config'
import { countConnect } from '@/utils/helpers/check.connect'
import roleModel from '@/models/role.model'
import { Role } from '@/utils/constants'

class Database {
  private static instance: Database

  private constructor() {
    this.connect()
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  private async connect(): Promise<void> {
    try {
      if (!envConfig.PRODUCTION) {
        mongoose.set('debug', true)
        mongoose.set('debug', { color: true })
      }

      await mongoose.connect(envConfig.DATABASE_URL)
      console.log('Database connection successful')
      await this.initDatabase()
      countConnect()
    } catch (err) {
      console.error('Database connection error', err)
      process.exit(1)
    }
  }

  private async initDatabase(): Promise<void> {
    try {
      const count = await roleModel.estimatedDocumentCount()

      if (count === 0) {
        await roleModel.insertMany([{ name: Role.ROLE_USER }, { name: Role.ROLE_ADMIN }])
        console.log("Added 'user' and 'admin' to roles collection")
      }
    } catch (error) {
      console.error('Error initializing database:', error)
    }
  }
}

export default Database
