import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { User } from "src/users/entities/user.entity";
import { Document, Types } from "mongoose";
import { JwtService } from "@nestjs/jwt";

export interface UsersProps {
  name: string;
  email: string;
  password: string;
}

interface UserDocument extends User, Document {
  _id: Types.ObjectId;
  __v: number;
}

type UserModel = Document<unknown, {}, UserDocument> &
  User & {
    _id: Types.ObjectId;
    __v: number;
  };

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user: any = await this.userService.findLogin(email, pass);

    if (user?.email !== email) {
      throw new UnauthorizedException();
    }

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, password: user.password };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}