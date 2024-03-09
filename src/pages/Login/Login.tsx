import { Box, Button, TextField } from "@mui/material";
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
import { Display } from "ui/Typography.tsx";

interface LoginForm extends ISignInRequest {}

const Login: React.FC = () => {
  const intl = useIntl();
  const { showAlert } = useAlert();
  const { setUser } = useUser();

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
          id: "login.singin.error",
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

  const navigate = useNavigate();

  const onSubmit = (data: ISignInRequest) => {
    signin(data);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Box width="500px" margin="auto">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap={8}
          width="100%"
        >
          <Display>Login</Display>

          <Box display="flex" flexDirection="column" gap={4} width="100%">
            <Controller
              control={control}
              name="email"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    type="email"
                    variant="outlined"
                    label={intl.formatMessage({
                      id: "login.email.label",
                      defaultMessage: "Email",
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    type="password"
                    variant="outlined"
                    label={intl.formatMessage({
                      id: "login.password.label",
                      defaultMessage: "Password",
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                  />
                );
              }}
            />
          </Box>
          <Button type="submit" variant="contained" fullWidth>
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
  );
};

export default Login;
