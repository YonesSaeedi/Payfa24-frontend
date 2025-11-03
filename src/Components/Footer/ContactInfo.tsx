import TelephoneIcon from "../../assets/icons/Footer/TelephoneIcon";
import EmailIcon from "../../assets/icons/Footer/EmailIcon";
import LocationIcon from "../../assets/icons/Footer/LocationIcon";

export default function ContactInfo(): React.JSX.Element {
  return (
    <div className="order-1 lg:order-2 flex flex-col text-end items-end sm:text-center lg:text-end sm:items-center lg:items-end space-y-5 justify-center pt-10">
      <h2 className="font-bold text-2xl">ارتباط با ما</h2>
      <div className="flex flex-col items-end sm:items-center lg:items-end gap-6 pt-2">
        <div className="flex flex-col items-end sm:items-center lg:items-end gap-4">
          <div className="flex items-end sm:items-center lg:justify-end">
            <span className="mr-2 text-lg font-bold">تماس</span>
            <span className="w-[22px] h-[22px] icon-wrapper">
              <TelephoneIcon />
            </span>
          </div>
          <a
            href="tel:021123456789"
            className="transition-colors duration-300 hover:text-blue10"
          >
          
            <span className="text-base font-normal">۰۲۱-۱۲۳۴۵۶۷۸۹</span>
          </a>
        </div>
        <div className="flex flex-col items-end sm:items-center lg:items-end gap-4">
          <div className="flex items-end sm:items-center lg:justify-end">
            <span className="mr-2 text-lg font-bold">ایمیل</span>
            <span className="w-[22px] h-[22px] icon-wrapper">
              <EmailIcon />
            </span>
          </div>
          <div className="flex">
            <a
              href="mailto:support@payfa24.com"
              className="transition-colors duration-300 hover:text-blue10"
            >
             
              <span className="text-base font-normal">support@payfa24.com</span>
            </a>
            <div className="w-px h-[20px] bg-gray-400 mx-4"></div>
            <a
              href="mailto:info@payfa24.com"
              className="transition-colors duration-300 hover:text-blue10"
            >
              
              <span className="text-base font-normal">info@payfa24.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end sm:items-center lg:items-end gap-1 pt-2">
        <div className="flex items-end sm:items-center lg:justify-end">
          <span className="mr-2 text-lg font-bold">آدرس</span>
          <span className="w-[22px] h-[22px] icon-wrapper">
            <LocationIcon />
          </span>
        </div>
        <span className="mt-2 text-base font-normal">
          ارومیه شهرک شهریار خیابان حیدربابا 16 متری دوم نبش کوچه 8 پلاک 82
        </span>
      </div>
    </div>
  );
}
