import { FC } from "react";
import UserProfileOverview from "@/common/UserProfileOverview";
import { type UserRole } from "@/constants/roles";

interface EmployeeProfileDetailCardProps {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  address: string;
  avatar: string;
  createdAt?: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
  phone: string;
  bio?: string | null;
  googleId?: string | null;
  isVerified?: boolean | null;
  id?: string;
  isDeleted?: boolean | null;
}

const EmployeeProfileDetailCard: FC<EmployeeProfileDetailCardProps> = (
  props
) => <UserProfileOverview user={props} />;

export default EmployeeProfileDetailCard;
