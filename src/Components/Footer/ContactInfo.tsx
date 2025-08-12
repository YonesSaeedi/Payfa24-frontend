import TelephoneIcon from "../Icons/Footer/TelephoneIcon";
import EmailIcon from "../Icons/Footer/EmailIcon";
import LocationIcon from "../Icons/Footer/LocationIcon";

export default function ContactInfo(): React.JSX.Element {
  return (
    <div className="order-1 lg:order-2 flex flex-col text-right space-y-5 justify-center">
      <h2 className="text-lg font-bold">ارتباط با ما</h2>

      
      <div className="flex ml-auto gap-8">

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center">
            <span className="mr-2">ایمیل</span>
            <EmailIcon />
          </div>
          <span>PayFarF@gmail.com</span>
        </div>

      
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center">
            <span className="mr-2">تماس</span>
            <TelephoneIcon />
          </div>
          <span>۰۲۱-۱۲۳۴۵۶۷۸۹</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center">
          <span className="mr-2">آدرس</span>
          <LocationIcon />
        </div>
        <span>
          میدان شهید بهشتی، خیابان امام خمینی، جنب پارک شورا، شهر اردبیل، استان اردبیل.
        </span>
      </div>
    </div>
  );
}
