import { JSX, lazy } from "solid-js";
import { Route, Routes } from "@solidjs/router";
// glob import all components in ./component-pages
const pages = import.meta.glob('./component-pages/*'); 

type Import = () => Promise<{ default: () => JSX.Element;}>;

export default () => {
    let RouteFromComponentMap = () => {
        return Object.entries(pages).map(([sourceFile, importFn], _) =>
            <Route path={getPath(sourceFile)} component={lazy(importFn as Import)}></Route>
        );
    }
    return <Routes> 
      <RouteFromComponentMap />
    </Routes>
}

function getPath(sourceFile: string):string {
    if (sourceFile == "./component-pages/home.tsx") {
        return "/";
    }

    let regex = /[a-z-]+(?=\.tsx$)/;
    let result = regex.exec(sourceFile);
    if (result === null) {
        throw new Error(`Unable to detect file name from sourceFile: ${sourceFile}`);
    }
    return result[0];
}