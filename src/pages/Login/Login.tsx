import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { ISignInRequest } from "project-2-types/dist/interface";
import LoginSchema from "project-2-types/dist/ajv/signin.ajv";
import endpoints from "api/endpoints.ts";
import { login } from "../../api/login.ts";
import { useAlert } from "context/AlertProvider.tsx";
import { useIntl } from "react-intl";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "context/UserProvider.tsx";
import { validateResolver } from "shared/ajv.ts";
import LogoLight from "assets/images/Logo.svg";
import LogoDark from "assets/images/LogoDark.svg";
import Background from "assets/images/login.jpg";
import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useThemMode } from "context/ThemeProvider.tsx";

interface LoginForm extends ISignInRequest {}

const Login: React.FC = () => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const { mode } = useThemMode();

  const Logo = mode === "light" ? LogoLight : LogoDark;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "all",
    resolver: validateResolver(LoginSchema),
  });

  const { isLoading, mutate: signin } = useMutation({
    mutationKey: [endpoints.signin],
    mutationFn: login,
    onSuccess: (data) => {
      data?.user && setUser(data.user);
      showAlert(
        intl.formatMessage({
          id: "login.singin.welcome.back",
          defaultMessage: "Welcome back!",
        }),
        "success"
      );
      navigate("/");
    },
    onError: () => {
      showAlert(
        intl.formatMessage({
          id: "login.signin.error",
          defaultMessage:
            "Oops! Seems like you are having issues when logging in, please contact support.",
        }),
        "error"
      );
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (data: ISignInRequest) => {
    signin(data);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      sx={
        desktop
          ? {
              background: `url(${Background}) lightgray 50% / cover no-repeat`,
            }
          : {
              background: `url(${Background}) lightgray 50% / cover no-repeat`,
              backgroundPosition: "32%",
            }
      }
    >
      <Box
        display="flex"
        flexDirection={desktop ? "row" : "column"}
        justifyContent={desktop ? "flex-start" : "flex-end"}
        height={desktop ? "auto" : "100%"}
        width="100%"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap="4rem"
          width={desktop ? "100%" : "auto"}
          maxWidth="564px"
          margin={desktop ? "0 0 0 50vw" : "1rem"}
          padding={desktop ? "3.5rem" : "2rem"}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: "var(--radius-xl, 0.75rem)",
          }}
        >
          <Box display="flex" justifyContent="center">
            {<img src={Logo} height="50.96px" />}
          </Box>

          <Box display="flex" flexDirection="column" gap="2.5rem" width="100%">
            <Controller
              control={control}
              name="email"
              render={({ field }) => {
                return (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <InputLabel htmlFor="login-email">
                      {intl.formatMessage({
                        id: "login.email.label",
                        defaultMessage: "Email",
                      })}
                    </InputLabel>

                    <TextField
                      {...field}
                      id="login-email"
                      type="email"
                      variant="outlined"
                      size="small"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      fullWidth
                    />
                  </Box>
                );
              }}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => {
                return (
                  <Box display="flex" flexDirection="column" gap={1}>
                    <InputLabel htmlFor="login-password">
                      {intl.formatMessage({
                        id: "login.password.label",
                        defaultMessage: "Password",
                      })}
                    </InputLabel>
                    <TextField
                      {...field}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      size="small"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <EyeSlash /> : <Eye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                );
              }}
            />
            <Button type="submit" variant="contained" fullWidth size="small">
              {intl.formatMessage(
                {
                  id: "login.button.submit",
                  defaultMessage:
                    "{isLoading, plural, one {Loading...} other {Login} }",
                },
                { isLoading: Number(!!isLoading) }
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
