import { UsernamePasswordInput } from "src/resolvers/user";

export const validateRegister = (options: UsernamePasswordInput) => {
  const { username, email, password } = options;

  if (!email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'email need to have @.',
      }
    ];
  }

  if (username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'length must be greater than 2',
      }
    ];
  }

  if (username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'Invalid character @.',
      }
    ];
  }

  if (password.length <= 3) {
    return [
      {
        field: 'password',
        message: 'length must be greater than 3',
      }
    ];
  }

  return null;
};