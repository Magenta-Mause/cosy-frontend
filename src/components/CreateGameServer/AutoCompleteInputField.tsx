import { GameServerCreationContext } from "@components/CreateGameServer/CreateGameServerModal.tsx";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import type * as React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ZodType } from "zod";
import type { GameServerCreationDto } from "@/api/generated/model";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useTranslationPrefix from "@/hooks/useTranslationPrefix/useTranslationPrefix";
import { type InputType, preProcessInputValue } from "@/lib/utils";
import { GameServerCreationPageContext } from "./GenericGameServerCreationPage";

const DEBOUNCE_DELAY = 500;

type AutoCompleteItem = {
  value: string;
  label: string;
  leftSlot?: React.ReactNode;
};

interface Props {
  attribute: keyof GameServerCreationDto;
  validator: ZodType;
  placeholder: string;
  errorLabel: string;
  getAutoCompleteItems: (val: string) => Promise<AutoCompleteItem[]>;
  inputType: InputType;
}

function AutoCompleteInputField({
  attribute,
  validator,
  placeholder,
  getAutoCompleteItems,
  inputType,
}: Props) {
  const { t } = useTranslationPrefix("components.CreateGameServer.autoCompleteInputField");
  const { setGameServerState, gameServerState } = useContext(GameServerCreationContext);
  const { setAttributeValid, setAttributeTouched } = useContext(GameServerCreationPageContext);
  const [autoCompleteItems, setAutoCompleteItems] = useState<AutoCompleteItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAttributeTouched(attribute, gameServerState[attribute] !== undefined);
    setAttributeValid(attribute, validator.safeParse(gameServerState[attribute]).success);
  }, [gameServerState, attribute, setAttributeTouched, setAttributeValid, validator]);

  const queryAutoCompleteItems = useCallback(
    async (value: string) => {
      setLoading(true);
      try {
        const items = await getAutoCompleteItems(value);
        setAutoCompleteItems(items);
      } catch {
        setAutoCompleteItems([]);
      } finally {
        setLoading(false);
      }
    },
    [getAutoCompleteItems],
  );

  const selectGame = useCallback(
    (item: AutoCompleteItem) => {
      const value = preProcessInputValue(item.value, inputType);
      const valid = validator.safeParse(value).success;

      setDisplayName(item.label);
      setOpen(false);
      setGameServerState(attribute)(value);
      setAttributeValid(attribute, valid);
      setAttributeTouched(attribute, true);
    },
    [attribute, inputType, setAttributeTouched, setAttributeValid, setGameServerState, validator],
  );

  return (
    <Popover open={open}>
      <PopoverTrigger>
        <Input
          placeholder={placeholder}
          id={attribute}
          value={displayName}
          onChange={(e) => {
            const currentValue = e.target.value;
            setDisplayName(currentValue);

            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }
            debounceRef.current = setTimeout(() => {
              setOpen(() => true);
              void queryAutoCompleteItems(currentValue);
            }, DEBOUNCE_DELAY);
          }}
          autoComplete="off"
        />
      </PopoverTrigger>

      <PopoverContent className="w-fit">
        <Command>
          <CommandList>
            {loading && (
              <CommandItem key="loading" onSelect={() => {}}>
                <p>{t("loadingLabel")}</p>
              </CommandItem>
            )}
            {autoCompleteItems.length > 0 ? (
              autoCompleteItems.slice(0, 5).map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => selectGame(item)}
                  className="flex-auto items-center"
                >
                  <div className="shrink-0">{item.leftSlot}</div>
                  <Label className="text-xl">{item.label}</Label>
                </CommandItem>
              ))
            ) : (
              <CommandItem
                key="unknown-game"
                onSelect={() =>
                  selectGame({
                    value: "0",
                    label: "Unknown Game",
                  })
                }
              >
                <Label>{t("noResultsLabel")}</Label>
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default AutoCompleteInputField;
