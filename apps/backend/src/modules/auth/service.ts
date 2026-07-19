import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authRepository from "./repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "smart-rt-secret-key";

interface LoginBody {
  email?: string;
  username?: string;
  password: string;
}

export async function login(payload: LoginBody) {
  const { email, username, password } = payload;

  if ((!email && !username) || !password) {
    throw {
      status: 400,
      message: "Email or username and password are required",
      code: "VALIDATION_ERROR",
    };
  }

  const user = email
    ? await authRepository.findByEmail(email)
    : await authRepository.findByUsername(username!);
  if (!user) {
    throw {
      status: 401,
      message: "Invalid email/username or password",
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
      message: "Invalid email/username or password",
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
      username: user.username,
      role,
      statusKeanggotaan: user.warga?.statusKeanggotaan ?? null,
      jabatan: user.pengurusRt?.jabatan ?? null,
    },
  };
}
