import { FC, type ReactNode } from "react";
import { Chip, Typography } from "@mui/material";
import {
  Calendar,
  Mail02,
  MarkerPin02,
  PhoneCall01,
} from "@untitled-ui/icons-react";
import moment from "moment";
import UserRoleBadge from "@/common/UserRoleBadge";
import { USER_ROLE, type UserRole } from "@/constants/roles";

interface UserProfileOverviewProps {
  user: {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    role?: UserRole | null;
    address?: string | null;
    avatar?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    deletedAt?: Date | string | null;
    phone?: string | null;
    bio?: string | null;
    googleId?: string | null;
    isVerified?: boolean | null;
    isDeleted?: boolean | null;
  };
}

const formatDate = (value?: Date | string | null) => {
  if (!value) {
    return "Not available";
  }

  return moment(value).format("MMM D, YYYY [at] h:mma");
};

const getDisplayValue = (value?: string | null, fallback = "Not provided") =>
  value && value.trim() ? value : fallback;

const DetailItem: FC<{
  label: string;
  value: string;
  subdued?: boolean;
}> = ({ label, value, subdued = false }) => (
  <div className="space-y-1 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-4">
    <Typography color="grey.500" className="text-xs font-semibold uppercase tracking-[0.08em] font-inter">
      {label}
    </Typography>
    <Typography
      color={subdued ? "grey.600" : "grey.900"}
      className={`font-inter ${subdued ? "text-sm" : "text-sm font-medium"}`}
    >
      {value}
    </Typography>
  </div>
);

const DetailSection: FC<{
  title: string;
  description: string;
  children: ReactNode;
}> = ({ title, description, children }) => (
  <section className="rounded-[24px] border border-[#EAECF0] bg-white p-6 shadow-sm">
    <div className="mb-5 space-y-1">
      <Typography color="grey.900" className="text-xl font-bold font-crimson">
        {title}
      </Typography>
      <Typography color="grey.600" className="text-sm font-inter">
        {description}
      </Typography>
    </div>
    <div className="grid gap-4 md:grid-cols-2">{children}</div>
  </section>
);

const UserProfileOverview: FC<UserProfileOverviewProps> = ({ user }) => {
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unnamed user";
  const normalizedRole = user.role || USER_ROLE.USER;
  const isVerified = Boolean(user.isVerified);
  const isDeleted = Boolean(user.isDeleted || user.deletedAt);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded border-[#101828] bg-white shadow-sm">
        <div className="bg-[#101828] px-6 py-8 text-white lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Typography className="text-3xl font-bold text-white capitalize font-crimson">
                    {fullName}
                  </Typography>
                  <UserRoleBadge role={normalizedRole} />
                </div>

                <Typography className="text-sm font-inter text-white/80">
                  Detailed user record for admin review.
                </Typography>

                <div className="flex flex-wrap gap-2">
                  <Chip
                    label={isVerified ? "Verified Account" : "Pending Verification"}
                    className="!border !border-white/15 !bg-white/10 !text-white"
                    variant="outlined"
                  />
                  <Chip
                    label={isDeleted ? "Archived / Deleted" : "Active Account"}
                    className="!border !border-white/15 !bg-white/10 !text-white"
                    variant="outlined"
                  />
                  <Chip
                    label={user.googleId ? "Google Linked" : "Email Auth"}
                    className="!border !border-white/15 !bg-white/10 !text-white"
                    variant="outlined"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
              <div className="px-4 py-4 border rounded-2xl border-white/10 bg-white/5">
                <div className="flex items-center gap-2 mb-1 text-white/70">
                  <Mail02 width={16} height={16} />
                  <span className="font-inter text-xs uppercase tracking-[0.08em]">
                    Email
                  </span>
                </div>
                <Typography className="text-sm font-medium text-white break-all font-inter">
                  {getDisplayValue(user.email, "No email")}
                </Typography>
              </div>

              <div className="px-4 py-4 border rounded-2xl border-white/10 bg-white/5">
                <div className="flex items-center gap-2 mb-1 text-white/70">
                  <PhoneCall01 width={16} height={16} />
                  <span className="font-inter text-xs uppercase tracking-[0.08em]">
                    Phone
                  </span>
                </div>
                <Typography className="text-sm font-medium text-white font-inter">
                  {getDisplayValue(user.phone, "No phone")}
                </Typography>
              </div>

              <div className="px-4 py-4 border rounded-2xl border-white/10 bg-white/5 sm:col-span-2">
                <div className="flex items-center gap-2 mb-1 text-white/70">
                  <MarkerPin02 width={16} height={16} />
                  <span className="font-inter text-xs uppercase tracking-[0.08em]">
                    Address
                  </span>
                </div>
                <Typography className="text-sm font-medium text-white font-inter">
                  {getDisplayValue(user.address)}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 bg-[#F8FAFC] px-6 py-6 lg:px-8 xl:grid-cols-[1.3fr,1fr]">
          <div className="space-y-6">
            <DetailSection
              title="Contact And Identity"
              description="Primary identity and contact information available for this user."
            >
              <DetailItem label="First Name" value={getDisplayValue(user.firstName)} />
              <DetailItem label="Last Name" value={getDisplayValue(user.lastName)} />
              <DetailItem label="Email Address" value={getDisplayValue(user.email, "No email")} />
              <DetailItem label="Phone Number" value={getDisplayValue(user.phone, "No phone")} />
              <DetailItem
                label="Role"
                value={normalizedRole.split("_").join(" ")}
              />
              <DetailItem label="Address" value={getDisplayValue(user.address)} />
            </DetailSection>

            <section className="rounded-[24px] border border-[#EAECF0] bg-white p-6 shadow-sm">
              <div className="mb-5 space-y-1">
                <Typography color="grey.900" className="text-xl font-bold font-crimson">
                  Bio And Notes
                </Typography>
                <Typography color="grey.600" className="text-sm font-inter">
                  Extended profile information supplied by the user.
                </Typography>
              </div>
              <div className="rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] p-5">
                <Typography color="grey.700" className="text-sm leading-7 font-inter">
                  {getDisplayValue(user.bio, "No bio has been added to this account yet.")}
                </Typography>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <DetailSection
              title="Account Status"
              description="Verification, authentication method, and user record health."
            >
              <DetailItem
                label="Verification"
                value={isVerified ? "Verified" : "Pending"}
              />
              <DetailItem
                label="Account State"
                value={isDeleted ? "Archived / Deleted" : "Active"}
              />
              <DetailItem
                label="Auth Provider"
                value={user.googleId ? "Google" : "Email / Password"}
              />
              <DetailItem
                label="Google Link"
                value={user.googleId ? "Connected" : "Not connected"}
              />
            </DetailSection>

            <DetailSection
              title="Lifecycle And System"
              description="Admin-facing record identifiers and lifecycle timestamps."
            >
              <DetailItem label="User ID" value={getDisplayValue(user.id, "Unavailable")} />
              <DetailItem label="Created On" value={formatDate(user.createdAt)} />
              <DetailItem label="Last Updated" value={formatDate(user.updatedAt)} />
              <DetailItem label="Deleted On" value={formatDate(user.deletedAt)} subdued={!user.deletedAt} />
            </DetailSection>

            <section className="rounded-[24px] border border-[#EAECF0] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar width={18} height={18} color="#101828" />
                <Typography color="grey.900" className="text-xl font-bold font-crimson">
                  Activity Snapshot
                </Typography>
              </div>
              <div className="grid gap-4">
                <DetailItem label="Joined" value={formatDate(user.createdAt)} />
                <DetailItem label="Most Recent Update" value={formatDate(user.updatedAt)} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileOverview;
