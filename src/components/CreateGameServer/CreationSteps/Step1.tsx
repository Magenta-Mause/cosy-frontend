import AutoCompleteInputField from "@components/CreateGameServer/AutoCompleteInputField";
import GenericGameServerCreationPage from "@components/CreateGameServer/GenericGameServerCreationPage.tsx";
import { useCallback } from "react";
import * as z from "zod";
import { getGameInfo } from "@/api/generated/backend-api";
import useTranslationPrefix from "@/hooks/useTranslationPrefix/useTranslationPrefix";
import { InputType } from "@/lib/utils";

const GameServerCreationGameNamePage = () => {
  const { t } = useTranslationPrefix("components.CreateGameServer.steps.step1");

  const queryGames = useCallback((val: string) => {
    return getGameInfo({ query: val }).then((res) =>
      res.map((game) => ({
        value: String(game.id),
        label: game.name,
        leftSlot: (
          <img
            src={game.logo_url}
            alt={game.name}
            className="h-6 w-auto rounded-md mr-2 object-contain"
          />
        ),
      })),
    );
  }, []);

  return (
    <GenericGameServerCreationPage>
      <AutoCompleteInputField
        attribute="game_id"
        validator={z.number().min(0)}
        placeholder={t("gameSelection.placeholder")}
        errorLabel={t("gameSelection.errorLabel")}
        getAutoCompleteItems={queryGames}
        inputType={InputType.number}
      />
    </GenericGameServerCreationPage>
  );
};

export default GameServerCreationGameNamePage;
