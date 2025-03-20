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

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_at: string;
}

export interface TokenRefresh {
  refresh_token: string;
}
