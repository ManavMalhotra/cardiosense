"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setAuthStatus, clearUser } from "@/store/authSlice";
import type { User } from "@/lib/types";
// import LoadingSpinner from "../common/LoadingSpinner";
import { Progress } from "@/components/ui/progress";

const AUTH_ROUTES = ["/login", "/register", "/complete-profile"];
const PROTECTED_ROUTES = ["/dashboard"];

// This is a placeholder, create a real one in components/common/
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    Loading...
  </div>
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(setAuthStatus("loading"));
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val() as User;
          dispatch(setUser(userData));
        } else {
          // **NEW LOGIC**: User is authenticated but has no profile data.
          // This is the "complete profile" state. We clear any old user data
          // but keep them authenticated.
          dispatch(clearUser());
          dispatch(setAuthStatus("succeeded")); // Mark auth check as done
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (status === "loading") return;

    const firebaseUser: FirebaseUser | null = auth.currentUser;
    const isProtectedRoute = PROTECTED_ROUTES.some((p) =>
      pathname.startsWith(p)
    );
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    // Case 1: Not authenticated, trying to access a protected route
    if (!firebaseUser && isProtectedRoute) {
      router.push("/login");
      return;
    }

    // Case 2: Authenticated, but has no profile in our DB yet.
    // Force them to complete their profile.
    if (firebaseUser && !user && pathname !== "/complete-profile") {
      router.push("/complete-profile");
      return;
    }

    // Case 3: Fully authenticated (profile exists), trying to access an auth page
    if (user && isAuthRoute) {
      router.push("/dashboard");
      return;
    }
  }, [user, status, pathname, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // Prevent flicker for redirects
  const firebaseUser = auth.currentUser;
  if (firebaseUser && !user && pathname !== "/complete-profile")
    return <LoadingSpinner />;
  if (!firebaseUser && PROTECTED_ROUTES.some((p) => pathname.startsWith(p)))
    return <LoadingSpinner />;

  return children;
}
