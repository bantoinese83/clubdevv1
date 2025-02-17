import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const login = (provider: string) => signIn(provider, { callbackUrl: "/" })
  const logout = () => signOut()

  return {
    session,
    status,
    login,
    logout,
    isAuthenticated: !!session,
    isLoading: status === "loading",
  }
}

