import { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Logo from "/sportygalaxy-logo.svg";
import TextField from "@mui/material/TextField/TextField";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import IconButton from "@mui/material/IconButton/IconButton";
import { Eye, EyeOff, Lock01, Mail01 } from "@untitled-ui/icons-react";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import Typography from "@mui/material/Typography/Typography";
import Wave from "@/assets/svgs/bg-wave.svg";
import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import { LoadingButton } from "@mui/lab";
import { routeEnum } from "@/constants/RouteConstants";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

interface AuthLoginProps {}

const AuthLogin: FC<AuthLoginProps> = () => {
  const navigate = useNavigate();
  const { showSuccessSnackbar, showErrorSnackbar } = useExtendedSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [login, loginResult] = sportygalaxyAdminApi.useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          email: values.email,
          password: values.password,
        };
        const data = await login({
          ...payload,
        }).unwrap();

        showSuccessSnackbar(data?.message || "Successful");
        navigate(routeEnum.DASHBOARD);
      } catch (error: any) {
        showErrorSnackbar(error?.data?.error || "Error occured");
      }
    },
  });

  const isValid = !(
    formik.values.email === "" ||
    formik.values.password === "" ||
    loginResult.isLoading
  );

  return (
    <div className="relative flex flex-col items-center justify-start h-screen">
      <div className="container-wrapper mt-20 w-full max-w-[700px] z-[1]">
        <img src={Logo} alt="logo" />

        <div className="mt-14">
          <Typography
            color="grey.900"
            className="text-3xl font-bold font-crimson"
          >
            Admin Sign In
          </Typography>
          <Typography
            color="grey.700"
            className="text-sm font-normal font-inter"
          >
            Sign in with an admin, staff, or super admin account.
          </Typography>
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-8 space-y-5">
          <div className="flex flex-col">
            <Typography
              color="grey.700"
              component="label"
              className="text-sm font-medium font-inter"
              htmlFor="email"
            >
              Email
            </Typography>
            <TextField
              className="MuiTextFieldOutlined--plain mr-3 max-w-[480px] bg-white"
              placeholder="olivia@sportygalaxy.com"
              style={{ maxWidth: "none" }}
              fullWidth
              size="small"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Mail01
                        width={16}
                        height={16}
                        className="text-[#667085]"
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="flex flex-col">
            <Typography
              color="grey.700"
              component="label"
              className="text-sm font-medium font-inter"
              htmlFor="password"
            >
              Password
            </Typography>
            <TextField
              className="MuiTextFieldOutlined--plain mr-3 max-w-[480px] bg-white"
              placeholder="••••••••"
              style={{ maxWidth: "none" }}
              fullWidth
              size="medium"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Lock01
                        width={16}
                        height={16}
                        className="text-[#667085]"
                      />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    onClick={togglePasswordVisibility}
                    position="end"
                  >
                    <IconButton>
                      {showPassword ? (
                        <Eye
                          width={16}
                          height={16}
                          className="text-[#667085]"
                        />
                      ) : (
                        <EyeOff
                          width={16}
                          height={16}
                          className="text-[#667085]"
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2">
              <Checkbox
                className="outlined"
                size="small"
                name="remember"
                checked={formik.values.remember}
                onChange={formik.handleChange}
              />
              <Typography
                color="grey.700"
                className="text-xs font-medium sm:text-sm font-inter"
              >
                Remember for 30 days
              </Typography>
            </div>
            <Link
              className="text-[#027A48] text-xs sm:text-sm font-inter font-bold hover:underline cursor-pointer"
              to="/"
            >
              Forgot password
            </Link>
          </div>

          <div className="mt-5">
            <LoadingButton
              disabled={!isValid}
              loading={loginResult.isLoading}
              fullWidth
              variant="contained"
              className="text-base font-bold capitalize font-inter"
              type="submit"
            >
              Sign in
            </LoadingButton>
          </div>
        </form>
      </div>

      <img className="fixed bottom-0 bg-repeat" src={Wave} alt="bg-wave" />
    </div>
  );
};

export default AuthLogin;
