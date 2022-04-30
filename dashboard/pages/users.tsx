import { useState } from "react";
import { Container } from "reactstrap";
import { Header, Menu, Button, Modal, Icon } from "semantic-ui-react";
import { RequireAuth } from "../src/auth/components/requireAuth";
import { DashboardNavigation } from "../src/shared/components/dashboardNavigation/dashboardNavigation";
import { CreateUserModal } from "../src/users/components/createUserModal";
import { DeleteUserModal } from "../src/users/components/deleteUserModal";
import { UpdateUserModal } from "../src/users/components/updateUserModal";
import { UsersTable } from "../src/users/components/usersTable";
import { StaffTable } from "../src/users/components/staffTable";

export default function Users() {
  const [activeItem, setActiveItem] = useState("student");
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  return (
    <RequireAuth
      render={({ auth }) => {
        return (
          <>
            <DashboardNavigation role={auth?.user?.role} />
            <Container>
              <Header as="h1">Users</Header>

              <Menu pointing secondary>
                <Menu.Item
                  name="student"
                  active={activeItem === "student"}
                  onClick={() => setActiveItem("student")}
                >
                  Students
                </Menu.Item>
                <Menu.Item
                  name="staff member"
                  active={activeItem === "staff member"}
                  onClick={() => setActiveItem("staff member")}
                >
                  Staff
                </Menu.Item>
              </Menu>

              <Button onClick={() => setIsCreateUserModalOpen(true)} primary>
                Add {activeItem}
              </Button>

              {activeItem === "student" && (
                <UsersTable
                  onEditClick={setIsUpdateUserModalOpen}
                  onDeleteClick={setIsDeleteUserModalOpen}
                  rows={[
                    {
                      firstName: "Nicol",
                      lastName: "Vojacek",
                      childId: "nic123",
                      age: 8,
                      school: "FHP",
                      teacher: "Rory James",
                      readingLevel: 1,
                      lastLoggedIn: "2 April 2022",
                      aveReadingTime: 29,
                    },
                    {
                      firstName: "Michele",
                      lastName: "Lemonius",
                      age: 7,
                      childId: "mic123",
                      school: "FHP",
                      teacher: "Rory James",
                      readingLevel: 2,
                      lastLoggedIn: "2 April 2022",
                      aveReadingTime: 31,
                    },
                  ]}
                />
              )}

              {isCreateUserModalOpen && (
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
              )}

              {activeItem === "staff member" && (
                <StaffTable
                  onEditClick={setIsUpdateUserModalOpen}
                  onDeleteClick={setIsDeleteUserModalOpen}
                  rows={[
                    {
                      firstName: "Nicol",
                      lastName: "Vojacek",
                      email: "nic@gmail.com",
                      school: "FHP",
                      role: "Teacher",
                      lastLoggedIn: "2 April 2022",
                      aveOnlineTime: 100,
                    },
                    {
                      firstName: "Michele",
                      lastName: "Lemonius",
                      email: "mic@gmail.com",
                      school: "FHP",
                      role: "Principal",
                      lastLoggedIn: "3 April 2022",
                      aveOnlineTime: 120,
                    },
                  ]}
                />
              )}
            </Container>
          </>
        );
      }}
    />
  );
}
