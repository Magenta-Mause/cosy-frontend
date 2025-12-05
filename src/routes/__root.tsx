import GameServerOverviewPageRightClickHandler
  from "@components/display/configurations/GameServerOverviewPageRightClickHandler/GameServerOverviewPageRightClickHandler.tsx";
import LanguageSelector
  from "@components/display/configurations/HeaderButtonGroup/LanguageSelector/LanguageSelector.tsx";
import {createRootRoute, Outlet} from "@tanstack/react-router";
import HeaderButtonGroup from "@components/display/configurations/HeaderButtonGroup/HeaderButtonGroup.tsx";

const RootLayout = () => {
  return (
    <GameServerOverviewPageRightClickHandler>
      <div>
        <HeaderButtonGroup className={"absolute z-100 top-0 right-0 mx-[2vw] my-[1vw]"}/>
        <Outlet/>
      </div>
    </GameServerOverviewPageRightClickHandler>
  );
};

export const Route = createRootRoute({component: RootLayout});
