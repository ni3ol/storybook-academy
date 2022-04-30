import { Button } from "semantic-ui-react";
import { DataTable } from "../../shared/components/dataTable/dataTable";

export const StaffTable = ({
  rows,
  onEditClick: onEditClick,
  onDeleteClick: onDeleteClick,
}: {
  rows: any;
  onEditClick: any;
  onDeleteClick: any;
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
            <Button onClick={() => onEditClick(true)} primary>
              Edit
            </Button>
            <Button onClick={() => onDeleteClick(true)}>Delete</Button>
          </>
        ),
      },
    ]}
  />
);
