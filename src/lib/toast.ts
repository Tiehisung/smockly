import { toast } from "sonner";
import type { IApiResponse } from "../types";

export const smartToast = ({ success, message, error, }: Partial<Omit<IApiResponse, 'error'> & { error: any }>) => {

    const msg = message || error?.data?.message || error?.message || error?.toString()
    const type = error ? false : success

    switch (type) {
        case true:
            return toast.success(msg, { position: 'bottom-center' });
        case false:
            return toast.error(msg, { position: 'bottom-center' });
        default:
            return toast(msg, { position: 'bottom-center' });
    }
};