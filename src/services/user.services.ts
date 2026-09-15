import { User } from "../model/user.model.js";

class UserService {
  async getOneUser(id: string) {
    const user = await User.findById(id).select("-password -email");

    if (!user) throw new Error("User not found");

    return user;
  }

  async getMe(id: string) {
    const user = await User.findById(id).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  }
}

export const userService = new UserService();
