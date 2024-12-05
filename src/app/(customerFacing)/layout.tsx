import { ReactNode } from 'react';
import { Nav, NavLink } from "@/components/Nav"

// FORCES NEXT JS NOT TO CACHE ADMIN PAGES (ALWAYS DYNAMICALLY GENERATED)
export const dynamic = 'force-dynamic'

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Nav>
        <NavLink href="/"> Home </NavLink>
        <NavLink href="/products"> Products </NavLink>
        <NavLink href="/orders"> My Orders </NavLink>
      </Nav>
      <div className="container my-6">
        {children}
      </div>
    </>
  );
}