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

  defaultSeason: any | undefined;
  updateDefaultSeason: (values: any) => void;
} | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, updateUser] = usePersistedState("user", initialState);
  const [season, updateDefaultSeason] = usePersistedState<any | undefined>(
    "season",
    undefined
  );

  const clearUser = () => {
    setUser(initialState);
  };

  const setUser = (data: IUserState) => {
    updateUser({
      name: data?.name ?? "",
      farm: {
        _id: data?.farm?._id ?? "",
        name: data?.farm?.name ?? "",
        address: data?.farm?.address ?? "",
        isDisabled: data?.farm?.isDisabled ?? false,
      },
    });
    updateDefaultSeason({
      _id: "65f4698c9b4918c4f0110a8b",
      name: "BBBB",
      startDate: 1710516386938,
      status: "ACTIVE",
      farm: {
        _id: "65d703cf9a00b1a671609458",
        name: "Emerald Harvest Farms",
        address: "Emerald Harvest Farms\n1234 Rural Road\nColumbia, Colombia",
      },
      product: {
        _id: "65f3d9508ee7fc06724abc0b",
        name: "Llapingacho",
      },
      unit: {
        _id: "65f3d9738ee7fc06724abc15",
        name: "kg",
      },
      currency: {
        _id: "65e2ce183ac3c95f4e8674b8",
        name: "USD$",
      },
      deductions: [
        {
          deductionID: "65f3d9498ee7fc06724abc07",
          price: 1,
          _id: "65f4698c9b4918c4f0110a8c",
        },
      ],
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        clearUser,

        defaultSeason: season,
        updateDefaultSeason,
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
