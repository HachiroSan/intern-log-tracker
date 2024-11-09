import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { WeekendSystem, User } from "@/types";
import { auth, db } from "@/lib/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { DateRange } from "react-day-picker";

interface UserContextProps {
  weekendSystem: WeekendSystem;
  setWeekendSystem: (system: WeekendSystem) => void;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
  email: string | null;
  isInitialSetupComplete: boolean;
  setIsInitialSetupComplete: (isComplete: boolean) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [weekendSystem, setWeekendSystem] = useState<WeekendSystem>(undefined);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isInitialSetupComplete, setIsInitialSetupComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setIsInitialSetupComplete(userData.isInitialSetupComplete || false);
          setWeekendSystem(userData.weekendSystem || undefined);
          setDateRange({
            from:
              userData.startDate instanceof Timestamp
                ? userData.startDate.toDate()
                : userData.startDate,
            to:
              userData.endDate instanceof Timestamp
                ? userData.endDate.toDate()
                : userData.endDate,
          });
        } else {
          const newUser: User = {
            id: user.uid,
            name: user.displayName || "Unknown",
            email: user.email || "Unknown",
            createdAt: new Date(),
            updatedAt: new Date(),
            isInitialSetupComplete: false,
          };
          await setDoc(userDocRef, newUser);
        }
      } else {
        setUserId(null);
        setEmail(null);
        setIsInitialSetupComplete(false);
        setWeekendSystem(undefined);
        setDateRange({ from: undefined, to: undefined });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateFirestore = async () => {
      if (userId) {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        const currentData = userDoc.data() as User;

        if (
          (weekendSystem && currentData.weekendSystem !== weekendSystem) ||
          (dateRange.from && currentData.startDate !== dateRange.from) ||
          (dateRange.to && currentData.endDate !== dateRange.to)
        ) {
          const updateData: Partial<User> = {};

          if (weekendSystem) {
            updateData.weekendSystem = weekendSystem;
          }

          if (dateRange.from) {
            updateData.startDate = dateRange.from;
          }

          if (dateRange.to) {
            updateData.endDate = dateRange.to;
          }

          if (isInitialSetupComplete) {
            updateData.isInitialSetupComplete = true;
          }
          await updateDoc(userDocRef, updateData);
        }
      }
    };

    updateFirestore();
  }, [weekendSystem, dateRange, userId, isInitialSetupComplete]);

  return (
    <UserContext.Provider
      value={{
        weekendSystem,
        setWeekendSystem,
        dateRange,
        setDateRange,
        email,
        isInitialSetupComplete,
        setIsInitialSetupComplete,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
