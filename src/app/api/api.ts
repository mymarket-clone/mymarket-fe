export const API_URL = 'https://localhost:7289/api/'

export const api = {
  loginUser: 'auth/LoginUser',
  registerUser: 'auth/RegisterUser',
  userExists: 'auth/userExists',
  sendEmailVerificationCode: 'auth/SendEmailVerificationCode',
  verifyEmailCode: 'auth/VerifyEmailCode',
  sendPasswordRecovery: 'auth/SendPasswordRecovery',
  passwordRecovery: 'auth/PasswordRecovery',
  verifyPasswordCode: 'auth/VerifyPasswordCode',
  getCategories: 'categories',
} as const
