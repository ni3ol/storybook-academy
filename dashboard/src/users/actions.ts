import { makeRequest } from "../shared/utils";
import { userSchema } from "./model";
import { z } from "zod";

type Filters = {
  id?: string;
  search?: string;
};

export const getUsers = async ({
  authToken,
  filters,
}: {
  authToken: string;
  filters?: Filters;
}) => {
  const { data }: { data: any } = await makeRequest({
    authToken,
    method: "get",
    path: "/users",
    queryParams: filters,
  });
  const users = data.entities.map((dto: any) =>
    userSchema
      .extend({
        createdAt: z.string().transform((d) => new Date(d)),
      })
      .parse(dto)
  );
  return users;
};
