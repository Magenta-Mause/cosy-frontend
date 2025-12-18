import Step1 from "@components/CreateGameServer/CreationSteps/Step1";
import Step2 from "@components/CreateGameServer/CreationSteps/Step2";
import Step3 from "@components/CreateGameServer/CreationSteps/Step3";
import { Button } from "@components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMain,
  DialogTitle,
} from "@components/ui/dialog.tsx";
import { Input } from "@components/ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import useTranslationPrefix from "@/hooks/useTranslationPrefix/useTranslationPrefix";

interface EditGameServerDialogProps {
  serverName: string;
  onConfirm: () => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGameServerModal({
  serverName,
  onConfirm,
  open,
  onOpenChange,
}: EditGameServerDialogProps) {
  const { t } = useTranslationPrefix("EditGameServerDialog");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const isConfirmButtonDisabled = inputValue !== serverName || loading;

  const handleConfirm = async () => {
    if (isConfirmButtonDisabled) return;

    if (inputValue === serverName) {
      setLoading(true);
      try {
        await onConfirm();
        setInputValue(""); // Clear input after confirmation
        onOpenChange(false); // Close dialog on success
      } catch (_e) {
        // Error is already handled by the hook, no need to toast here
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (loading) return; // Prevent closing while loading
    onOpenChange(newOpen);
    if (!newOpen) {
      setInputValue(""); // Clear input when dialog closes
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={"font-mono"}>
        <DialogHeader>
          <DialogTitle>{t("title", { serverName })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <DialogMain>
          <Step1 />
          <Step2 />
          <Step3 />
        </DialogMain>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="h-[50px]" variant="secondary" disabled={loading}>
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            className={"h-[50px]"}
            disabled={isConfirmButtonDisabled}
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default EditGameServerModal;
