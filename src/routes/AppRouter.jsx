import { Routes, Route, Navigate } from "react-router-dom";
import ROUTES from "./routesModel"; 
import { useCurrentUser } from "../users/providers/UserProvider";
import CardsPage from "../pages/CardsPage.jsx";
import FavoriteCardsPage from "../pages/FavoriteCardsPage.jsx";
import  MyCardsPage from "../pages/MyCardsPage.jsx";
import CreateCardPage from "../pages/CreateCardPage.jsx";
import EditCardPage from "../pages/EditCardPage.jsx";
import CardDetailsPage  from "../pages/CardDetailsPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import EditProfilePage from "../pages/EditProfilePage.jsx";
import AboutPage from "../pages/AboutPage.jsx";


function RequireAuth({ children, businessOnly = false }) {
  const { user } = useCurrentUser();
  if (!user) return <Navigate to={ROUTES.login} replace />;
  if (businessOnly && !user.isBusiness) return <Navigate to={ROUTES.root} replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<CardsPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />
      <Route
        path={typeof ROUTES.cardInfo === "function" ? ROUTES.cardInfo() : "/cards/:id"}
        element={<CardDetailsPage />}
      />
      <Route
        path={ROUTES.favorite}
        element={
          <RequireAuth>
            <FavoriteCardsPage />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.myCards}
        element={
          <RequireAuth>
            <MyCardsPage />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.createCard}
        element={
          <RequireAuth businessOnly>
            <CreateCardPage />
          </RequireAuth>
        }
      />
      <Route
        path={typeof ROUTES.editCard === "function" ? ROUTES.editCard() : "/cards/edit/:id"}
        element={
          <RequireAuth businessOnly>
            <EditCardPage />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.profileEdit}
        element={
          <RequireAuth>
            <EditProfilePage />
          </RequireAuth>
        }
      />
      <Route path={ROUTES.about} element={<AboutPage />} />
      <Route path={ROUTES.favorite} element={<FavoriteCardsPage />} />
      <Route path="*" element={<Navigate to={ROUTES.root} replace />} />
    </Routes>
  );
}
