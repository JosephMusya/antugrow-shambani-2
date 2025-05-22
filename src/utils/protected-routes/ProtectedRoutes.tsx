import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import Login from "@/pages/Login";
import { useUserContext } from "@/providers/UserAuthProvider";
import { Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const { loadingUser, authUser } = useUserContext();

  

  if (loadingUser) {
    return <LoadingSkeleton/>;
  } else if(!loadingUser && (authUser == null)){
    return <Login/>
  } else {
    return <Outlet />;
  }

};
