import TelephoneIcon from "../../assets/icons/Footer/TelephoneIcon";
import EmailIcon from "../../assets/icons/Footer/EmailIcon";
import LocationIcon from "../../assets/icons/Footer/LocationIcon";

export default function ContactInfo(): React.JSX.Element {
  return (
    <div className="order-1 lg:order-2 flex flex-col text-right space-y-5 justify-center pt-8 lg:pt-0">
      <h2 className="text-lg font-bold">ارتباط با ما</h2>
      <div className="flex flex-col ml-auto gap-8">
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center">
            <span className="mr-2">تماس</span>
            <span className="w-[22px] h-[22px] icon-wrapper">
              <TelephoneIcon />
            </span>
          </div>
          <a
            href="tel:021123456789"
            className="transition-colors duration-300 hover:text-gray-200"
          >
            <span className="w-[22px] h-[22px] icon-wrapper">
              <TelephoneIcon />
            </span>
            <span>۰۲۱-۱۲۳۴۵۶۷۸۹</span>
          </a>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center">
            <span className="mr-2">ایمیل</span>
            <span className="w-[22px] h-[22px] icon-wrapper">
              <EmailIcon />
            </span>
          </div>
          <div className="flex">
            <a
              href="mailto:support@payfa24.com"
              className="transition-colors duration-300 hover:text-gray-200"
            >
              <span className="w-[22px] h-[22px] icon-wrapper">
                <EmailIcon />
              </span>
              <span>support@payfa24.com</span>
            </a>
            <div className="w-px h-[20px] bg-gray-400 mx-4"></div>
            <a
              href="mailto:info@payfa24.com"
              className="transition-colors duration-300 hover:text-gray-200"
            >
              <span className="w-[22px] h-[22px] icon-wrapper">
                <EmailIcon />
              </span>
              <span>info@payfa24.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center">
          <span className="mr-2">آدرس</span>
          <span className="w-[22px] h-[22px] icon-wrapper">
            <LocationIcon />
          </span>
        </div>
        <span>
          ارومیه شهرک شهریار خیابان حیدربابا 16 متری دوم نبش کوچه 8 پلاک 82
        </span>
      </div>
    </div>
  );
}
