import { AuthSession } from "../authSessions/model";
import { makeRequest } from "../shared/utils";
import { User } from "../users/model";

export const signIn = async ({
  emailAddress: emailAddress,
  password,
}: {
  emailAddress: string;
  password: string;
}) => {
  const {
    data: { user, authSession },
  }: { data: { user: User; authSession: AuthSession } } = await makeRequest({
    method: "post",
    path: "/signIn",
    data: { emailAddress: emailAddress, password },
  });
  return { user, authSession };
};

export const signUp = async ({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const {
    data: { user, authSession },
  }: { data: { user: any; authSession: any } } = await makeRequest({
    method: "post",
    path: "/signUp",
    data: { firstName, lastName, email, password },
  });
  return { user, authSession };
};
