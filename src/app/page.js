
import Image from "next/image";
import Landing from "./index";
import products from "./products";
import { appRouterContext } from "next/dist/server/route-modules/app-route/shared-modules";
import LoginPage from "./loginpage";
import RegisterPage from "./registerpages";
import Principal from "./principal";

export default function Home() {
  return (
    //<RegisterPage/>
    //<LoginPage/>
    <Principal/>
  );
}
