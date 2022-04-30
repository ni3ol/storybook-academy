import { Button } from "semantic-ui-react";
import { DataTable } from "../../../components/dataTable/dataTable";

export const LibraryTable = ({
  rows,
  setIsUpdateMaterialModalOpen,
  setIsDeleteMaterialModalOpen,
}: {
  rows: any;
  setIsUpdateMaterialModalOpen: any;
  setIsDeleteMaterialModalOpen: any;
}) => (
  <DataTable
    rows={rows}
    headers={[
      {
        key: "title",
        title: "Title",
        resolve: (row: any) => row.title,
      },
      {
        key: "course",
        title: "Course",
        resolve: (row: any) => row.course,
      },
      {
        key: "area",
        title: "Area",
        resolve: (row: any) => row.area,
      },
      {
        key: "readingDate",
        title: "Reading date",
        resolve: (row: any) => row.readingDate,
      },
      {
        key: "levels",
        title: "Levels",
        resolve: (row: any) => row.levels,
      },
      {
        key: "actions",
        title: "Actions",
        resolve: (row: any) => (
          <>
            <Button onClick={() => setIsUpdateMaterialModalOpen(true)} primary>
              Edit
            </Button>
            <Button onClick={() => setIsDeleteMaterialModalOpen(true)}>
              Delete
            </Button>
          </>
        ),
      },
    ]}
  />
);
