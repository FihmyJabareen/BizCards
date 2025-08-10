import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";

import UserProvider from "./users/providers/UserProvider.jsx";
import SnackbarProvider from "./providers/SnackbarProvider.jsx"; 
import Header from "./layout/header/Header.jsx";
import AppRouter from "./routes/AppRouter.jsx";
import Footer from "../src/layout/footer/Footer.jsx" 
import CustomThemeProvider from "./providers/CustomThemeProvider.jsx"; 

export default function App() {
  return (
   <UserProvider>
     <CustomThemeProvider>
       <SnackbarProvider>
         <BrowserRouter>
           <CssBaseline />
           <Header />
            <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
            <Suspense fallback={<div>Loading...</div>}>
              <AppRouter />
              <Footer/>
            </Suspense>
          </Container>
        </BrowserRouter>
      </SnackbarProvider>
    </CustomThemeProvider>
    </UserProvider>
  );
}
