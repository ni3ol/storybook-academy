import { useRouter } from "next/router";
import { Auth, useAuth } from "../hooks";

export const RequireAuth = ({
  render,
  adminOnly,
}: {
  render: ({ auth }: { auth: Auth }) => any;
  adminOnly?: boolean;
}) => {
  const auth = useAuth();
  const router = useRouter();

  const authData =
    auth.isAuthenticated() &&
    auth.auth.token &&
    auth.auth.userId &&
    auth.auth.user &&
    auth.auth.authSession
      ? (auth.auth as Auth)
      : undefined;

  if (auth.auth?.status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  const result =
    auth.isAuthenticated() && authData ? (
      !adminOnly || (adminOnly && authData.user.isAdmin) ? (
        render({ auth: authData })
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20%",
          }}
        >
          Not authorized
        </div>
      )
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20%",
        }}
      >
        <div>Loading...</div>
      </div>
    );

  return result;
};
