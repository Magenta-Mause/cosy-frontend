import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React from "react";

const RootLayout = () => (
  <React.Fragment>
    {/* Configure application shell here  */}
    <Outlet />

    {/* Please don't move me :'< ((if you are building a shell just keep me down here, I won't interfere!)) */}
    <ReactQueryDevtools initialIsOpen={false} />
    <TanStackRouterDevtools initialIsOpen={false} />
  </React.Fragment>
);

export const Route = createRootRoute({ component: RootLayout });
