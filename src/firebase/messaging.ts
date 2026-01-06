import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "./firebase";

/**
 * گرفتن توکن FCM برای کاربر
 */
export const requestFirebaseToken = async (): Promise<string | null> => {
  try {
    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging); // بدون vapidKey
    if (currentToken) {
      return currentToken;
    } else {
      return null;
    }
  } catch { return null }
};

/**
 * شنیدن نوتیفیکیشن‌ها در foreground
 */
export const onMessageListener = (callback: (payload: any) => void) => {
  const messaging = getMessaging(app);
  onMessage(messaging, callback);
};
