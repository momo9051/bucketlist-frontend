export interface AuthUserProfile {
  sub?: string;
  name?: string;
}

export interface AuthUser {
  access_token?: string;
  profile?: AuthUserProfile;
}
