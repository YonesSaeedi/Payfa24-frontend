import { toast } from "react-toastify";
import { apiRequest } from "../../utils/apiClient";

interface AddCardResponse {
  status: boolean;
  msg: string;
}

interface AddCardRequest {
  CardNumber: string;
  [key: string]: string | number | boolean | Blob | File;
}

export const AddCardApi= async (cardNumber: string) => {
  const cleanedNumber = cardNumber.replace(/-/g, "").trim();

  if (cleanedNumber.length !== 16) {
    toast.error("شماره کارت باید دقیقاً 16 رقم باشد!");
    return null;
  }

  try {
    const response = await apiRequest<AddCardResponse, AddCardRequest>({
      url: "/account/credit-card",
      method: "POST",
      data: { CardNumber: cleanedNumber },
    });

    if (response?.status) {
      toast.success("کارت با موفقیت ثبت شد!");
      return response;
    } else {
      toast.error(response?.msg || "ثبت کارت ناموفق بود");
      return null;
    }
  } catch (err: any) {
    toast.error(
      err?.response?.data?.msg ||
      err?.response?.data?.message ||
      "در ثبت کارت مشکلی پیش آمد."
    );
    return null;
  }
};
