import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../store/context";
import { initTokenRefreshCoordinator } from "../service/api/TokenRefreshCoordinator";

export const useAuthRefreshCoordinator = () => {
  const [, dispatch] = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    initTokenRefreshCoordinator(dispatch, navigate);
  }, [dispatch, navigate]);
}
