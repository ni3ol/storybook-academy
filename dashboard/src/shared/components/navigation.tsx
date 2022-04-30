/* eslint-disable react/display-name */
import Link from "next/link";
import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  NavLink,
} from "reactstrap";
import { useRouter } from "next/router";
import { forwardRef } from "react";

export const Navigation = () => {
  const router = useRouter();
  return (
    <Navbar expand="lg">
      <Link href="/" passHref>
        <NavbarBrand>Storybook Academy</NavbarBrand>
      </Link>
      <NavbarToggler aria-controls="responsive-navbar-nav" />
      <Collapse navbar>
        <Nav className="me-auto" />
        <Nav>
          <Link href="/sign-in" passHref>
            <NavLink active={router.pathname === "/sign-in"}>Sign in</NavLink>
          </Link>
          <Link href="/sign-up" passHref>
            <NavLink active={router.pathname === "/sign-up"}>Sign up</NavLink>
          </Link>
        </Nav>
      </Collapse>
    </Navbar>
  );
};
