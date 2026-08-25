import bcrypt from "bcryptjs";
import { User } from "../model/user.model";
import type { loginDTO, signupDTO } from "../schema/user.schema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { email } from "zod";

class AuthService {
  async signup({ email, name, password }: signupDTO) {
    const normalizedEmail = email.toLowerCase();
    const existsEmail = await User.findOne({ email: normalizedEmail });

    if (existsEmail) {
      throw new Error("");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    const payload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login({ email, password }: loginDTO) {
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) throw new Error("Email or password incorrect!");

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new Error("Email or password incorrect!");
    }

    const { password: _password, ...safeUser } = user.toObject();

    const payload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    return generateAccessToken({
      userId: payload.userId,
      email: payload.email,
    });
  }
}

export const authService = new AuthService();
