import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "./repository.js";

const JWT_SECRET = "smart-rt-secret-key";

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

  let passwordMatch;
  if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
    passwordMatch = await bcrypt.compare(password, user.password);
  } else {
    passwordMatch = password === user.password;
  }

  if (!passwordMatch) {
    throw {
      status: 401,
      message: "Invalid email or password",
      code: "INVALID_CREDENTIALS",
    };
  }

  const token = jwt.sign({ id: user.idMasyarakat }, JWT_SECRET, {
    expiresIn: "24h",
  });

  let role: "RESIDENT" | "OFFICER" | "CHAIRPERSON" = "RESIDENT";

  if (user.pengurusRt) {
    role = user.pengurusRt.jabatan == "CHAIRPERSON" ? "CHAIRPERSON" : "OFFICER";
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
