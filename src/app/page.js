import Image from "next/image";
import Landing from "./components/index";
import ProductosPage from "./components/products";
import { appRouterContext } from "next/dist/server/route-modules/app-route/shared-modules";
import LoginPage from "./components/loginpage";
import RegisterPage from "./components/registerpages";
import Principal from "./components/principal";
import DashboardPage from '../../pages/Dashboard'
//import { Router } from "next/router";
export default function Home() {
  return (
    <Principal/>
  );
}
