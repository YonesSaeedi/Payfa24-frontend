import TelephoneIcon from "../../assets/icons/Footer/TelephoneIcon";
import EmailIcon from "../../assets/icons/Footer/EmailIcon";
import LocationIcon from "../../assets/icons/Footer/LocationIcon";

export default function ContactInfo(): React.JSX.Element {
  return (
    <div className="order-1 lg:order-2 flex flex-col text-right space-y-5 justify-center">
      <h2 className="text-lg font-bold">ارتباط با ما</h2>

      
      <div className="flex flex-col ml-auto gap-8">


         <div className="flex flex-col items-end gap-1">
          <div className="flex items-center">
            <span className="mr-2">تماس</span>
            <TelephoneIcon />
          </div>
          <span>۰۲۱-۱۲۳۴۵۶۷۸۹</span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center">
            <span className="mr-2">ایمیل</span>
            <EmailIcon />
          </div>
          <div className="flex">
            <span>support@payfa24.com</span>
             <div className="w-px h-[20px] bg-gray-400 mx-4"></div>
          <span>info@payfa24.com</span>
          </div>
          
        </div>

      
       
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center">
          <span className="mr-2">آدرس</span>
          <LocationIcon />
        </div>
        <span>
        ارومیه شهرک شهریار خیابان حیدربابا 16 متری دوم نبش کوچه 8 پلاک 82
        </span>
      </div>
    </div>
  );
}
