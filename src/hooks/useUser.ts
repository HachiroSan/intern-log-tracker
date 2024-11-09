import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { User } from "@/types";

export const useUser = (userId: string | null) => {
  const [snapshot, loading, error] = useDocument(
    userId ? doc(db, "users", userId) : null
  );

  const user: User | null = snapshot?.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as User)
    : null;

  return { user, loading, error };
};
