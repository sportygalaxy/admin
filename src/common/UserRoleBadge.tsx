import { FC } from "react";
import { ROLE_LABELS, USER_ROLE, type UserRole } from "@/constants/roles";

const roleStyles: Record<UserRole, string> = {
  [USER_ROLE.SUPER_ADMIN]: "bg-[#101828] text-white border-[#101828]",
  [USER_ROLE.ADMIN]: "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]",
  [USER_ROLE.STAFF]: "bg-[#F2AAF7] text-[#344054] border-[#D0D5DD]",
  [USER_ROLE.USER]: "bg-white text-[#344054] border-[#D0D5DD]",
};

interface UserRoleBadgeProps {
  role?: UserRole | null;
}

const UserRoleBadge: FC<UserRoleBadgeProps> = ({ role }) => {
  const normalizedRole = role || USER_ROLE.USER;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold font-inter ${roleStyles[normalizedRole]}`}
    >
      {ROLE_LABELS[normalizedRole]}
    </span>
  );
};

export default UserRoleBadge;
