import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  email: string;
  userId: number;
  childName: string;
  avatar: string;
  score: number;
  achievements: string[];
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;