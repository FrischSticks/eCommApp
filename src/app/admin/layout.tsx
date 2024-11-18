import { ReactNode } from 'react';
import { Nav, NavLink } from "@/components/Nav"

// FORCES NEXT JS NOT TO CACHE ADMIN PAGES (ALWAYS DYNAMICALLY GENERATED)
export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Nav>
        <NavLink href="/admin"> Dashboard </NavLink>
        <NavLink href="/admin/products"> Products </NavLink>
        <NavLink href="/admin/users"> Customers </NavLink>
        <NavLink href="/admin/orders"> Sales </NavLink>
      </Nav>
      <div className="container my-6">
        {children}
      </div>
    </>
  );
}