import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import * as authRepository from "./repository.js";


if (!process.env.JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

interface LoginBody {
  email: string;
  password: string;
}

export async function login(payload: LoginBody) {
  const { email, password } = payload;

  if (!email || !password) {
    throw {
      status: 400,
      message: "Email and password are required",
      code: "VALIDATION_ERROR",
    };
  }

  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw {
      status: 401,
      message: "Invalid email or password",
      code: "INVALID_CREDENTIALS",
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw {
      status: 401,
      message: "Invalid email or password",
      code: "INVALID_CREDENTIALS",
    };
  }

  const tokenPayload = { 
    id: user.idMasyarakat 
  };

  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"],
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, signOptions);

  let role: "RESIDENT" | "OFFICER" | "CHAIRPERSON" = "RESIDENT";
  if (user.pengurusRt) {
    role = user.pengurusRt.jabatan === "CHAIRPERSON" ? "CHAIRPERSON" : "OFFICER";
  }

  return {
    accessToken: token,
    user: {
      id: user.idMasyarakat,
      nama: user.nama,
      role,
    },
  };
}