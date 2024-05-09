declare namespace Express {
  interface LoggedUser {
    username: string;
    role: UserRole;
    id: string;
  }
  interface Request {
    user?: LoggedUser;
  }
}
