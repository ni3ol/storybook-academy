import Link from "next/link";
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  NavLink,
} from "reactstrap";
import { useRouter } from "next/router";
import { useAuth } from "../auth/hooks";

export const DashboardNavigation = () => {
  const router = useRouter();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.deAuthenticate();
    router.push("/sign-in");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Navbar color="light" expand container="sm">
        <Link href={"/dashboard"} passHref>
          <NavbarBrand>Storybook Academy</NavbarBrand>
        </Link>
        <NavbarToggler aria-controls="responsive-navbar-nav" />
        <Collapse navbar>
          <Nav></Nav>
          <Nav className="me-auto"></Nav>
          <Nav>
            <NavLink style={{ cursor: "pointer" }} onClick={handleSignOut}>
              Sign out
            </NavLink>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
