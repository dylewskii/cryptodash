export interface UserType {
  userId: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

export const defaultUser: UserType = {
  userId: "",
  username: "",
  email: "",
  isAuthenticated: false,
};
