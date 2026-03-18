import { Edit, Trash } from "lucide-react";

import UserForm from "./UserForm";

import { DROPDOWN } from "../../../components/Dropdown";
import { useAdminDeleteUserMutation } from "../../../store/api/user.api";
import type { IUser } from "../../../types/user.types";
import { smartToast } from "../../../lib/toast";
import { DIALOG } from "../../../components/Dialog";
import { CONFIRMDIALOG } from "../../../components/Confirm-dialog";

interface IProps {
  user?: IUser;
}

export function UserActions({ user }: IProps) {
  const [deleteUser, { isLoading: isDeleting }] = useAdminDeleteUserMutation();

  const handleDelete = async () => {
    if (!user?._id) return;

    try {
      const result = await deleteUser(user._id).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <DROPDOWN id={user?._id}>
      <ul>
        <li className="p-2 text-sm font-light border-b ">
          {user?.displayName}
        </li>
        <li>
          <DIALOG
            trigger={
              <>
                <Edit className="text-muted-foreground" /> Edit
              </>
            }
            title={<p>Edit User - {user?.displayName}</p>}
            triggerStyles="w-full justify-start"
            variant={"ghost"}
          >
            <UserForm user={user} />
          </DIALOG>
        </li>

        <li>
          <CONFIRMDIALOG
            trigger={
              <>
                <Trash size={24} /> Delete
              </>
            }
            triggerStyles="w-full justify-start"
            onConfirm={handleDelete}
            variant="destructive"
            title="Delete User"
            description={`Are you sure you want to delete ${user?.displayName}?`}
            isLoading={isDeleting}
          />
        </li>
      </ul>
    </DROPDOWN>
  );
}
