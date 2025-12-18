import {Input} from "@components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@components/ui/select.tsx";
import {UserEntityDtoRole} from "@/api/generated/model";

interface InviteFormProps {
  username: string;
  userRole: UserEntityDtoRole;
  onUsernameChange: (value: string) => void;
  onUserRoleChange: (value: UserEntityDtoRole) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isCreating: boolean;
}

export const InviteForm = ({username, userRole, onUsernameChange, onSubmit, onUserRoleChange}: InviteFormProps) => {
  const {t} = useTranslation();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="space-y-2">
        <label htmlFor="invite-username">{t("userModal.usernameLabel")}</label>
        <Input
          id="invite-username"
          placeholder={t("userModal.usernamePlaceholder")}
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />
        <p className="text-xs text-muted-foreground">{t("userModal.usernameDescription")}</p>
        <label htmlFor="invite-username">Role</label>
        <Select defaultValue={userRole} onValueChange={onUserRoleChange}>
          <SelectTrigger id={"invite-username"}>
            <SelectValue placeholder={"User Role"}/>
          </SelectTrigger>
          <SelectContent>
            {
              Object.keys(UserEntityDtoRole).filter(role => role != UserEntityDtoRole.OWNER).map((role) => (<SelectItem value={role}>{role}</SelectItem>))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
