import Image from "next/image";
import Landing from "./components/index";
import ProductosPage from "./components/products";
import { appRouterContext } from "next/dist/server/route-modules/app-route/shared-modules";
import LoginPage from "../../pages/loginpage";
import RegisterPage from "../../pages/registerpages";
import Principal from "../../pages/principal";
import DashboardPage from './../../pages/Dashboard'
export default function Home() {
  return (
    <Principal/>
  );
}
