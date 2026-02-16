export const API_URL = 'https://localhost:7289/api/'

export const api = {
  loginUser: 'auth/loginUser',
  registerUser: 'auth/registerUser',
  userExists: 'auth/userExists',
  sendEmailVerificationCode: 'auth/sendEmailVerificationCode',
  verifyEmailCode: 'auth/verifyEmailCode',
  sendPasswordRecovery: 'auth/sendPasswordRecovery',
  passwordRecovery: 'auth/passwordRecovery',
  refreshUser: 'auth/refreshUser',
  verifyPasswordCode: 'auth/verifyPasswordCode',
  getCategories: 'categories',
  addPost: 'posts',
  getAllCities: 'cities/getAll',
  image: 'images',
  getCategoryAttributeById: 'categoryAttributes',
} as const
