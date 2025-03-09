export interface UserCreate {
  email: string;
  password: string;
}

export interface UserResponse {
  email: string;
  id: string;
  created_at: string;
  is_verified: boolean;
}

export interface AuthError {
  detail: {
    loc: (string | number)[];
    msg: string;
    type: string;
  }[];
}
