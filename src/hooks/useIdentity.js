import React, { useEffect } from "react";

const [_useIdentityContext, _IdentityCtxProvider] = createCtx();
export const useIdentityContext = _useIdentityContext;

export function IdentityContextProvider({ children }) {
  const identity = useIdentity();
  return (
    <_IdentityCtxProvider value={identity}>{children}</_IdentityCtxProvider>
  );
}

// export const useIdentity = () => useContext(IdentityContext);

const useIdentity = () => {
  const [user, setUser] = React.useState(undefined);
  useEffect(() => {
    console.log("User updated", user);
  }, [user]);
  const _setUser = _user => {
    console.log("Setting user", _user);
    setUser(_user);
    return _user;
  };

  const onLogin = user => {
    _setUser(user);
  };

  return {
    user,
    onLogin,
    isLoggedIn: !!user
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
