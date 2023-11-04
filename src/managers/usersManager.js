import { usersModel } from "../db/models/users.model.js"

class UsersManager {
    async getById(id) {
        const response = await usersModel.findById(id)
        return response
    }

    async getByEmail(email) {
        const response = await usersModel.findOne({email})
        return response
    }

    async createOne(object) {
        const response = await usersModel.create(object)
        return response
    }
}

export const usersManager = new UsersManager()
