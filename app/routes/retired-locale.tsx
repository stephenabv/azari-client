import { redirect, type LoaderFunctionArgs } from "react-router";
import { englishPathFor } from "../lib/retired-locales";

/** Old language URLs (/ko/packages) permanently point to the English page. */
export function loader({ request }: LoaderFunctionArgs) {
  return redirect(englishPathFor(new URL(request.url)), 301);
}
