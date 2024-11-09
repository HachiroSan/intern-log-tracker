import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { Log } from "@/types";

export const useLogs = (userId: string | null) => {
  const logsQuery = userId
    ? query(
        collection(db, "logs"),
        where("userId", "==", userId),
        orderBy("date", "desc")
      )
    : null;

  const [snapshot, loading, error] = useCollection(logsQuery);

  const logs = snapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Log[];

  return { logs, loading, error };
};
