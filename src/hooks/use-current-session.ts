import { type Session } from "next-auth";
import { getSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// This hook doesn't rely on the session provider
export const useCurrentSession = () => {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<string>("unauthenticated");
  const pathName = usePathname();

  const retrieveSession = useCallback(async () => {
    try {
      setStatus("loading");
      const sessionData = await getSession();

      if (sessionData) {
        setData(sessionData);
        setStatus("authenticated");
        return;
      }

      setStatus("unauthenticated");
    } catch (error) {
      setStatus("unauthenticated");
      setData(null);
    }
  }, []);

  useEffect(() => {
    void retrieveSession();
    // use the pathname to force a re-render when the user navigates to a new page
  }, [retrieveSession, pathName]);

  return { data, status };
};
