import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function AdminProtected({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: any) => state.auth);
  const isAdmin = user?.role === "admin";
  return isAdmin ? children : redirect("/");
}