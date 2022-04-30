import { Button } from "semantic-ui-react";
import { DataTable } from "../../../components/dataTable/dataTable";

export const StaffTable = ({
  rows,
  setIsUpdateUserModalOpen,
  setIsDeleteUserModalOpen,
}: {
  rows: any;
  setIsUpdateUserModalOpen: any;
  setIsDeleteUserModalOpen: any;
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: "firstName",
        title: "First name",
        resolve: (row: any) => row.firstName,
      },
      {
        key: "lastName",
        title: "Last name",
        resolve: (row: any) => row.lastName,
      },
      {
        key: "email",
        title: "Email",
        resolve: (row: any) => row.email,
      },
      {
        key: "role",
        title: "Role",
        resolve: (row: any) => row.role,
      },
      {
        key: "school",
        title: "School",
        resolve: (row: any) => row.school,
      },
      {
        key: "aveOnlineTime",
        title: "Ave. online (minutes)",
        resolve: (row: any) => row.aveOnlineTime,
      },
      {
        key: "lastLoggedIn",
        title: "Last logged in",
        resolve: (row: any) => row.lastLoggedIn,
      },
      {
        key: "actions",
        title: "Actions",
        resolve: (row: any) => (
          <>
            <Button onClick={() => setIsUpdateUserModalOpen(true)} primary>
              Edit
            </Button>
            <Button onClick={() => setIsDeleteUserModalOpen(true)}>
              Delete
            </Button>
          </>
        ),
      },
    ]}
  />
);
