import Image from "next/image";
import Landing from "./index";
import products from "./products";
import { appRouterContext } from "next/dist/server/route-modules/app-route/shared-modules";

export default function Home() {
  return (
   //<Landing />
    <products/>
  );
}
