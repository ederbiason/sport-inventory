import { connectDB } from "@/app/configs/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
connectDB()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()

        // checar se usuário existe
        const userExists = await User.findOne({email: reqBody.email})

        if (userExists) {
            throw new Error("Usuário já existe!")
        }

        // cria o usuário
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(reqBody.password, salt)
        reqBody.password = hashedPassword
        const newUser = new User(reqBody)
        await newUser.save()

        return NextResponse.json({
            message: "Usuário criado com sucesso!",
            data: newUser
        })
    } catch (error: any) {
        return NextResponse.json({
            message: error.message,
        }, {
            status: 400
        })
    }
}
