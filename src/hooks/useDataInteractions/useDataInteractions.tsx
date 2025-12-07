import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  type CreateGameServerMutationBody,
  getGetAllGameServersQueryKey,
  useCreateGameServer,
  useDeleteGameServerById,
} from "@/api/generated/backend-api.ts";
import { gameServerSliceActions } from "@/stores/slices/gameServerSlice.ts";

const useDataInteractions = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutateAsync: deleteGameServerById } = useDeleteGameServerById({
    mutation: {
      onSuccess: (_data, variables) => {
        dispatch(gameServerSliceActions.removeGameServerConfiguration(variables.uuid));
        toast.success(t("toasts.deleteGameServerSuccess"));
      },
      // If the mutation fails, show an error toast
      onError: (err) => {
        toast.error(t("toasts.deleteGameServerError"));
        // rethrow error to allow for individual error handling
        throw err;
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAllGameServersQueryKey(),
        });
      },
    },
  });
  const deleteGameServer = async (uuid: string) => {
    await deleteGameServerById({ uuid });
  };

  const { mutateAsync: createGameServerMutateAsync } = useCreateGameServer({
    mutation: {
      onSuccess: (data) => {
        dispatch(gameServerSliceActions.addGameServerConfiguration(data));
        toast.success(t("toasts.createGameServerSuccess"));
      },
      onError: (err) => {
        toast.error(t("toasts.createGameServerError"));
        throw err;
      },
    },
  });
  const createGameServer = async (data: CreateGameServerMutationBody) => {
    return await createGameServerMutateAsync({ data });
  };

  return {
    deleteGameServer,
    createGameServer,
  };
};

export default useDataInteractions;
