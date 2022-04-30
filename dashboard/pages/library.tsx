import { useState } from "react";
import { Container } from "reactstrap";
import { Header, Menu, Button, Modal, Icon } from "semantic-ui-react";
import { RequireAuth } from "../src/auth/components/requireAuth";
import { DashboardNavigation } from "../src/components/dashboardNavigation/dashboardNavigation";
import { LibraryTable } from "../src/library/components/libraryTable/libraryTable";
import { CreateUserModal } from "../src/users/components/createUserModal/createUserModal";
import { DeleteUserModal } from "../src/users/components/deleteUserModal/deleteUserModal";
import { UpdateUserModal } from "../src/users/components/updateUserModal/updateUserModal";
import { UsersTable } from "../src/users/components/usersTable/usersTable";

export default function Library() {
  const [isCreateMaterialModalOpen, setIsCreateMaterialModalOpen] =
    useState(false);
  const [isUpdateMaterialModalOpen, setIsUpdateMaterialModalOpen] =
    useState(false);
  const [isDeleteMaterialModalOpen, setIsDeleteMaterialModalOpen] =
    useState(false);

  return (
    <RequireAuth
      render={({ auth }) => {
        return (
          <>
            <DashboardNavigation role={auth?.user?.role} />
            <Container>
              <Header as="h1">Library</Header>

              <Button
                onClick={() => setIsCreateMaterialModalOpen(true)}
                primary
              >
                Add material
              </Button>

              <LibraryTable
                setIsUpdateMaterialModalOpen={setIsUpdateMaterialModalOpen}
                setIsDeleteMaterialModalOpen={setIsDeleteMaterialModalOpen}
                rows={[
                  {
                    title: "The lion king",
                    course: "Conservation",
                    area: "Science",
                    readingDate: "",
                    levels: "1, 2, 3",
                  },
                  {
                    title: "Water in Kenya",
                    course: "Conservation",
                    area: "Science",
                    readingDate: "22 April 2022",
                    levels: "1, 2",
                  },
                ]}
              />

              {/* {isCreateUserModalOpen && (
                <CreateUserModal
                  open={isCreateUserModalOpen}
                  setOpen={setIsCreateUserModalOpen}
                />
              )}

              {isUpdateUserModalOpen && (
                <UpdateUserModal
                  open={isUpdateUserModalOpen}
                  setOpen={setIsUpdateUserModalOpen}
                />
              )}

              {isDeleteUserModalOpen && (
                <DeleteUserModal
                  open={isDeleteUserModalOpen}
                  setOpen={setIsDeleteUserModalOpen}
                />
              )} */}
            </Container>
          </>
        );
      }}
    />
  );
}
