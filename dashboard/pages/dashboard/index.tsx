import { Container } from "reactstrap";
import { RequireAuth } from "../../src/auth/components/requireAuth";
import { DashboardNavigation } from "../../src/components/dashboardNavigation";

export default function DailySummary() {
  return (
    <RequireAuth
      render={({ auth }) => {
        return (
          <>
            <DashboardNavigation />
            <Container>{JSON.stringify(auth)}</Container>
          </>
        );
      }}
    />
  );
}
