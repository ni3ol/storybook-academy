import { Button } from "semantic-ui-react";
import { DataTable } from "../../shared/components/dataTable/dataTable";

export const UsersTable = ({
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
        key: "childId",
        title: "Child ID",
        resolve: (row: any) => row.childId,
      },
      {
        key: "age",
        title: "Age",
        resolve: (row: any) => row.age,
      },
      {
        key: "school",
        title: "School",
        resolve: (row: any) => row.school,
      },
      {
        key: "teacher",
        title: "Teacher",
        resolve: (row: any) => row.teacher,
      },
      {
        key: "readingLevel",
        title: "Reading level",
        resolve: (row: any) => row.readingLevel,
      },
      {
        key: "aveReadingTime",
        title: "Ave. reading (minutes)",
        resolve: (row: any) => row.aveReadingTime,
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
