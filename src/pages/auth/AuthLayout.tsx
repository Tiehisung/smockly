import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../../components/buttons/Button";

export function AuthLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between gap-4 px-6 pt-4 border-b">
        <Button
          onClick={() => navigate(-1)}
          variant={"link"}
          className="text-start "
        >
          <ArrowLongLeftIcon /> Back
        </Button>
        <Link to="/" className="text-2xl font-bold text-blue-600">
          GH Smockly
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
