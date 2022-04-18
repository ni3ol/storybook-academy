import Link from "next/link";
import { Container, Nav, Navbar, Button } from "reactstrap";
import { Navigation } from "../src/components/navigation";

export default function Home() {
  return (
    <>
      <Container>
        <Navigation />
        <div
          style={{
            display: "flex",
            minHeight: "calc(90vh - 90px)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: "50px", padding: 28 }}>
              Welcome to Storybook Academy
            </h1>
            <div style={{ textAlign: "center" }}>
              <Link href="/sign-up" passHref>
                <Button color="primary" size="lg">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
