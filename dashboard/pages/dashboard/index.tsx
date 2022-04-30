import { Container } from "reactstrap";
import { Button, Segment } from "semantic-ui-react";
import { RequireAuth } from "../../src/auth/components/requireAuth";
import { DashboardNavigation } from "../../src/components/dashboardNavigation/dashboardNavigation";
import { DataTable } from "../../src/components/dataTable/dataTable";

export default function Dashboard() {
  return (
    <RequireAuth
      render={({ auth }) => {
        return (
          <>
            <DashboardNavigation role={auth?.user?.role} />
            <Container>{JSON.stringify(auth)}</Container>
          </>
        );
      }}
    />
  );
}
