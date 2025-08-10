const ROUTES = {
  root: "/",
  login: "/login",
  register: "/register",
  myCards: "/my-cards",
  favorite: "/favorites",
  createCard: "/cards/create",
  profileEdit: "/profile/edit",
  about: "/about",
  editCard: (id = ":id") => `/cards/edit/${id}`,
  cardInfo: (id = ":id") => `/cards/${id}`,
};

export default ROUTES;
