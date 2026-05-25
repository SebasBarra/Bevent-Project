export enum UserRole {
  ADMIN = 'Administrador',
  CLIENT = 'Cliente',
}

export type UserSession = {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

export type RegisterUserRequest = {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
};

export type UserId = {
  userId: string;
};
