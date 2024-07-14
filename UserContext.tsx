import React, { createContext, useState } from 'react';

interface SessionContextType {
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
}

const SessionContext = createContext<SessionContextType>({
    userId: '',
    setUserId: () => { throw new Error("setUserId function not provided") }
});

export const SessionProvider: React.FC = ({ children }) => {
    const [userId, setUserId] = useState<string>('');

    const contextValue: SessionContextType = {
        userId,
        setUserId,
    };

    return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
    const context = React.useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};