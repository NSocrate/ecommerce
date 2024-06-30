"use client";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { SignUp } from "../actions";
import { useRouter } from "next/navigation";
export default function Form() {
  const [visibility, setVisibility] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { pending } = useFormStatus();
  const [formState, formAction] = useFormState(SignUp, {
    ok: false,
    message: "",
    fieldValues: {
      login: "",
      password: "",
    },
    errors: undefined,
  });
  useEffect(() => {
    if (formState.ok) {
      formRef.current?.reset();
      router.replace("/");
    }
  }, [formState, router]);
  return (
    <form action={formAction} ref={formRef}>
      <Stack direction={"column"} spacing={2} p={5}>
        <TextField
          label="Pseudo"
          name="login"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" style={{}}>
                <Person2OutlinedIcon />
              </InputAdornment>
            ),
          }}
          required
          defaultValue={formState.fieldValues.login}
          error={Boolean(formState.fieldValues.login)}
          helperText={
            !formState.errors?.login
              ? "Saissisez votre login"
              : formState.errors?.login
          }
        />
        <TextField
          type={visibility ? "text" : "password"}
          name="password"
          label="Mot de passe"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setVisibility(!visibility)}>
                  {!visibility ? (
                    <Tooltip
                      title="Montrez"
                      arrow
                      enterDelay={500}
                      leaveDelay={200}
                    >
                      <VisibilityIcon />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Cachez"
                      arrow
                      enterDelay={500}
                      leaveDelay={200}
                    >
                      <VisibilityOffIcon />
                    </Tooltip>
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
          error={Boolean(formState.errors?.password)}
          defaultValue={formState.fieldValues.password}
          helperText={
            !formState.errors?.password
              ? formState.errors?.password
              : "Ne partagez pas votre mot de passe à personne"
          }
        />
        {!formState.ok && formState.message && (
          <Typography align="center" color={"secondary"}>
            {formState.message}
          </Typography>
        )}
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={pending}
          loading={pending}
        >
          S&apos;indetifier
        </LoadingButton>
      </Stack>
    </form>
  );
}
