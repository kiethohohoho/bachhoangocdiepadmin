// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
};

// ----------------------------------------------------------------------

export type JWTContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  login: (email: string, password: string) => Promise<void>;
  register: (
    password: string,
    firstname: string,
    lastname: string,
    email: string,
    phonenumber:string
  ) => Promise<void>;
  verify:(code:string)=>Promise<void>;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
  initialize: ()=> void;
};

export type FirebaseContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  login: (email: string, password: string) => void;
  register: (password: string, firstname: string, lastname: string, phonenumber: string) => void;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};

export type AWSCognitoContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  login: (email: string, password: string) => void;
  register: (password: string, firstName: string, lastName: string) => void;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};

export type Auth0ContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  // login: () => Promise<void>;
  logout: () => void;
  // To avoid conflicts between types this is just a temporary declaration.
  // Remove below when you choose to authenticate with Auth0.
  login: (email?: string, password?: string) => Promise<void>;
  register?: (
    password: string,
    firstname: string,
    lastname: string,
    phonenumber: string
  ) => Promise<void>;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};
