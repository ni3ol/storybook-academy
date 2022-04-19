import { Container } from "reactstrap";
import { Button, Segment } from "semantic-ui-react";
import { RequireAuth } from "../../src/auth/components/requireAuth";
import { DashboardNavigation } from "../../src/components/dashboardNavigation";

export default function DailySummary() {
  return (
    <RequireAuth
      render={({ auth }) => {
        return (
          <>
            <DashboardNavigation />
            <Container>
              {JSON.stringify(auth)}
              <Segment>
                Semantic UI here
                <Button>Click me</Button>
              </Segment>
            </Container>
          </>
        );
      }}
    />
  );
}
