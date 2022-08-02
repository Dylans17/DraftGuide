import { JSX, lazy } from "solid-js";
import { Navigate, Route, Routes } from "@solidjs/router";
import { getFileName } from "./util";
// glob import all components in ./component-pages
const pages = import.meta.glob('./component-pages/*');
type ImportComponent = () => Promise<{ default: () => JSX.Element;}>;

export default () => {
  let RouteFromComponentMap = () => {
    return Object.entries(pages).map(([sourceFile, importFn], _) =>
      <Route path={getFileName(sourceFile, "tsx")} component={lazy(importFn as ImportComponent)}></Route>
    );
  }
  return <Routes> 
    <RouteFromComponentMap />
    <Route path="/">
      <Navigate href="/home" />
    </Route>
  </Routes>
}