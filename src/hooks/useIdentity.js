import React, { useEffect } from "react";
import { clearTokens } from "../lib/auth";

const [_useIdentityContext, _IdentityCtxProvider] = createCtx();
export const useIdentityContext = _useIdentityContext;

export function IdentityContextProvider({ children }) {
  const identity = useIdentity();
  return (
    <_IdentityCtxProvider value={identity}>{children}</_IdentityCtxProvider>
  );
}

const useIdentity = () => {
  const [user, setUser] = React.useState(undefined);
  const _setUser = _user => {
    setUser(_user);
    return _user;
  };

  const onLogin = user => {
    _setUser(user);
  };

  const logout = () => {
    clearTokens();
    _setUser(null);
  };

  return {
    user,
    onLogin,
    isLoggedIn: !!user,
    logout
  };
};

function createCtx() {
  const ctx = React.createContext(undefined);
  function useCtx() {
    const c = React.useContext(ctx);
    if (!c) throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider];
}
