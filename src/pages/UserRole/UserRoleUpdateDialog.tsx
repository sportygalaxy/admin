import { FC, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useAuthUser from "@/hooks/useAuthUser";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import { ApiUserStoreSlice } from "@/api/ApiUserStoreSlice";
import {
  ROLE_LABELS,
  SUPER_ADMIN_EMAIL,
  USER_ROLE,
  type UserRole,
} from "@/constants/roles";

const restrictedAdminTargets: UserRole[] = [
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.ADMIN,
];

interface UserRoleUpdateDialogProps {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: UserRole;
  };
}

const UserRoleUpdateDialog: FC<UserRoleUpdateDialogProps> = ({ user }) => {
  const authUser = useAuthUser();
  const { showErrorSnackbar, showSuccessSnackbar } = useExtendedSnackbar();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role || USER_ROLE.USER);
  const [updateUserRole, updateUserRoleResult] =
    ApiUserStoreSlice.useUpdateUserRoleMutation();

  const normalizedEmail = user.email.trim().toLowerCase();
  const isLockedSuperAdmin = normalizedEmail === SUPER_ADMIN_EMAIL;
  const canEdit = useMemo(() => {
    if (isLockedSuperAdmin) {
      return false;
    }

    if (authUser?.role === USER_ROLE.SUPER_ADMIN) {
      return true;
    }

    if (authUser?.role === USER_ROLE.ADMIN) {
      return !restrictedAdminTargets.includes(user.role || USER_ROLE.USER);
    }

    return false;
  }, [authUser?.role, isLockedSuperAdmin, user.role]);

  const availableRoles = useMemo(() => {
    if (authUser?.role === USER_ROLE.SUPER_ADMIN) {
      return [USER_ROLE.ADMIN, USER_ROLE.STAFF, USER_ROLE.USER];
    }

    if (authUser?.role === USER_ROLE.ADMIN) {
      return [USER_ROLE.STAFF, USER_ROLE.USER];
    }

    return [];
  }, [authUser?.role]);

  const handleClose = () => {
    setOpen(false);
    setRole(user.role || USER_ROLE.USER);
  };

  const handleSubmit = async () => {
    try {
      const response = await updateUserRole({ id: user.id, role }).unwrap();
      showSuccessSnackbar(response?.message || "User role updated");
      handleClose();
    } catch (error: any) {
      showErrorSnackbar(error?.data?.error || "Error occured");
    }
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        className="capitalize font-inter font-semibold"
        disabled={!canEdit}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        {canEdit ? "Manage Role" : isLockedSuperAdmin ? "Locked" : "Restricted"}
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle className="font-crimson font-bold text-2xl">
          Manage User Role
        </DialogTitle>
        <DialogContent className="space-y-4 !pt-4">
          <div>
            <Typography color="grey.900" className="font-semibold font-inter">
              {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}
            </Typography>
            <Typography color="grey.600" className="font-inter text-sm">
              {user.email}
            </Typography>
          </div>

          <FormControl fullWidth size="small">
            <InputLabel id={`role-label-${user.id}`}>Role</InputLabel>
            <Select
              labelId={`role-label-${user.id}`}
              label="Role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
            >
              {availableRoles.map((availableRole) => (
                <MenuItem key={availableRole} value={availableRole}>
                  {ROLE_LABELS[availableRole]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography color="grey.600" className="font-inter text-sm">
            Only {SUPER_ADMIN_EMAIL} can remain super admin. Admins can assign
            staff and user roles only.
          </Typography>
        </DialogContent>
        <DialogActions className="!px-6 !pb-6">
          <Button onClick={handleClose} className="capitalize font-inter">
            Cancel
          </Button>
          <LoadingButton
            loading={updateUserRoleResult.isLoading}
            variant="contained"
            className="capitalize font-inter font-semibold"
            disabled={role === (user.role || USER_ROLE.USER)}
            onClick={handleSubmit}
          >
            Save Role
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserRoleUpdateDialog;
