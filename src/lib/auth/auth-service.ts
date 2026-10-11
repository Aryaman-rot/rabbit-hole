export interface AuthUser {
  uid: string;
  email: string;
  createdAt: string;
}

export type AuthErrorCode = "invalid-credentials" | "unknown";

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export interface AuthService {
  signUpWithEmail(email: string, password: string): Promise<AuthUser>;
  signInWithEmail(email: string, password: string): Promise<AuthUser>;
  signInWithGoogle(): Promise<AuthUser>;
  signOut(): Promise<void>;
  onAuthChange(callback: (user: AuthUser | null) => void): () => void;
}
