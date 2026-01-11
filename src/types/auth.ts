export interface AuthUserProfile {
  sub?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface AuthUser {
  access_token?: string;
  profile?: AuthUserProfile;
}
