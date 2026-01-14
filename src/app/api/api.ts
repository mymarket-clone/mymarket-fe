export const API_URL = 'https://localhost:7289/api/'

export const api = {
  loginUser: 'auth/loginUser',
  registerUser: 'auth/registerUser',
  userExists: 'auth/userExists',
  sendEmailVerificationCode: 'auth/sendEmailVerificationCode',
  verifyEmailCode: 'auth/verifyEmailCode',
  sendPasswordRecovery: 'auth/sendPasswordRecovery',
  passwordRecovery: 'auth/vasswordRecovery',
  verifyPasswordCode: 'auth/verifyPasswordCode',
  getCategories: 'categories',
  getByIdWithChildren: 'categories/getByIdWithChildren',
  getFlat: 'categories/getFlat',
} as const
