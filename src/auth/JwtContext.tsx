import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import { string } from 'yup/lib/locale';
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  VERIFY = 'VERIFY',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.VERIFY]: {
    isAuthenticated: boolean;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.VERIFY) {
    return {
      ...state,
      isAuthenticated: true,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get('/v1/users/profile');
        
        const { profile } = response.data;

        console.log("profile: ", response.data.profile)

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user : profile,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post('/v1/auth/login', {
      email,
      password,
    });

    const { tokens, profile } = response.data;
    
    setSession(tokens.access.token);

    localStorage.setItem('refreshToken', tokens.refresh.token);
      
    dispatch({
      type: Types.LOGIN,
      payload: {
        user: profile,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (password: string, firstname: string, lastname: string, email: string, phonenumber:string) => {
      const response = await axios.post('/v1/auth/register', {
        firstname,
        lastname,
        email,
        password,
        phonenumber
      });
      const { access, profile, refresh } = response.data;

      localStorage.setItem('refreshToken', refresh.token);
      
      setSession(access.token);
      dispatch({
        type: Types.REGISTER,
        payload: {
          user: profile,
        },
      });

      return response.data;
    },
    []
  );

  // Verify
  const verify = useCallback(
    async (code: string) => {
      const response = await axios.post('/v1/auth/verify-register', {
        code,
      });
      dispatch({
        type: Types.VERIFY,
        payload: {
          isAuthenticated: true,
        },
      });
      return response.data;
    },

    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      register,
      verify,
      logout,
      initialize
    }),
    [state.isInitialized, state.isAuthenticated, state.user, login, register, verify, logout, initialize]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
