import { usePersistedState } from "hooks/usePersistedState";
import React, { createContext, useContext } from "react";

type IUserState = {
  name: string;
  farm: {
    isDisabled: boolean;
    _id: string;
    name: string;
    address: string;
  };
};
const initialState: IUserState = {
  name: "",
  farm: {
    isDisabled: false,
    _id: "",
    address: "",
    name: "",
  },
};

export const UserContext = createContext<{
  user: IUserState;
  setUser: (user: IUserState) => void;
  clearUser: () => void;
} | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = usePersistedState("user", initialState);

  const clearUser = () => {
    setUser(initialState);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  return context;
};
