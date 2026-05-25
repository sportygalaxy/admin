import { type UserRole } from "@/constants/roles";
import { ServerResponse } from "./global";

export interface User{
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    address:string;
    isVerified:string;
    googleId:string;
    avatar:string;
    bio:string;
    createdAt:string;
    updatedAt:string;
    deletedAt:string;
    token:string;
    role: UserRole;
}

export type AuthUserResponse = ServerResponse<User>;

export type GetUserResponse = ServerResponse<User>;
export type GetMeResponse = ServerResponse<User | any>;

export type GetMeRequest = null;

export type GetUserInfoResponse = ServerResponse<User>;

export interface GetUserInfoRequest {
  id: string;
}
