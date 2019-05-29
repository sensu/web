import React, { useState, useCallback } from "/vendor/react";
import PropTypes from "prop-types";

import { Button, DialogActions, TextField } from "/vendor/@material-ui/core";

import { createStyledComponent } from "/lib/component/util";

const StyledDialoagActions = createStyledComponent({
  name: "SignInForm.Actions",
  component: DialogActions,
  styles: theme => ({
    marginTop: theme.spacing.unit * 5,
    textAlign: "right",
  }),
});

const SignInForm = ({ disabled, error, onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(
    ev => {
      onSubmit({ username, password });
      ev.preventDefault();
    },
    [username, password],
  );

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="username"
        label="Username"
        aria-label="Username"
        autoComplete="username"
        autoCorrect="false"
        autoCapitalize="none"
        disabled={disabled}
        spellCheck={false}
        fullWidth
        margin="normal"
        onChange={ev => setUsername(ev.target.value)}
        value={username}
        error={!!error}
      />
      <TextField
        type="password"
        name="password"
        label="Password"
        aria-label="Password"
        autoComplete="current-password"
        fullWidth
        onChange={ev => setPassword(ev.target.value)}
        value={password}
        disabled={disabled}
        error={!!error}
        helperText={error}
      />
      <StyledDialoagActions>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={disabled}
        >
          Sign in
        </Button>
      </StyledDialoagActions>
    </form>
  );
};

SignInForm.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

SignInForm.defaultProps = {
  disabled: false,
  error: null,
};

export default SignInForm;
