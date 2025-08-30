// import { useForm, Controller } from "react-hook-form";
// import StepperComponent from "./Stepper";
// import TextField from "../../InputField/TextField";
// import { useState } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { Link } from "react-router-dom";
// import OTPModal from "../../OTPModal";
// import IconClose from "../../../assets/Icons/Login/IconClose";

// type Props = {
//   onNext: () => void;
// };

// export default function StepEmail({ onNext }: Props) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [contactMethod, setContactMethod] = useState<"email" | "">("email");

//   const schema = yup.object().shape({
//     email: yup
//       .string()
//       .required("ایمیل  الزامی است.")
//       .test("email", "ایمیل  وارد شده معتبر نیست.", (value) => {
//         if (!value) return false;
//         const isEmail = yup.string().email().isValidSync(value);
//         return isEmail;
//       }),
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     getValues,
//   } = useForm({
//     defaultValues: { email: "" },
//     mode: "onChange",
//     resolver: yupResolver(schema),
//   });
//   const emailValue = watch("email");

//   const onSubmit = (data: any) => {
//     console.log("Form submitted:", data);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     onNext();
//   };

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full lg:mt-0 mt-6 lg:pb-36 pb-10 lg:rounded-2xl lg:px-8 px-4 lg:border border-gray26 lg:bg-gray27"
//       >
//         <div className="w-full flex justify-center items-center flex-col">
//           <StepperComponent currentStep={2} />

//           <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
//             ایمیل خود را وارد کنید
//           </p>

//           <Controller
//             name="email"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 label="ایمیل"
//                 type="text"
//                 error={errors.email?.message}
//                 {...field}
//                 className="w-full mt-2 bg-transparent"
//                 // autoComplete="off"
//               />
//             )}
//           />

//           <button
//             type="submit"
//             className="lg:mt-22 mt-12 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
//           >
//             ارسال کد تایید
//           </button>
//         </div>
//       </form>

//       {/* Modal */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
//           onClick={handleCloseModal}
//         >
//           <div
//             className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center flex-row-reverse justify-between">
//               <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
//                 {contactMethod === "email"
//                   ? "تایید شماره همراه"
//                   : "تایید ایمیل"}
//               </h2>
//               <span
//                 className="icon-wrapper h-6 w-6 cursor-pointer"
//                 onClick={handleCloseModal}
//               >
//                 <IconClose />
//               </span>
//             </div>

//             <p
//               className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24"
//               dir="rtl"
//             >
//               لطفا کد ارسالی به ایمیل زیر را وارد کنید {emailValue}
//             </p>

//             <div className="mt-[32px] mb-[48px]">
//               <OTPModal
//                 length={5}
//                 onChange={(code) => console.log("کد وارد شده:", code)}
//               />
//             </div>

//             <div className="flex gap-2 mb-8">
//               <button
//                 onClick={handleCloseModal}
//                 className="mt-4 w-[180px] h-[48px] border border-blue2 rounded-lg text-blue2 text-sm lg:text-medium"
//               >
//                 ویرایش ایمیل
//               </button>
//               <Link to={""}>
//                 <button
//                   onClick={handleCloseModal}
//                   className="mt-4 w-[200px] h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
//                 >
//                   تایید
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }







import { useForm, Controller } from "react-hook-form";
import StepperComponent from "./Stepper";
import TextField from "../../InputField/TextField";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import OTPModal from "../../OTPModal";
import IconClose from "../../../assets/Icons/Login/IconClose";

type Props = {
  onNext: () => void;
};

type FormValues = {
  email: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("ایمیل الزامی است.")
    .email("ایمیل وارد شده معتبر نیست."),
});

export default function StepEmail({ onNext}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "" },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const emailValue = watch("email");

  const onSubmit = (data: FormValues) => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onNext();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:mt-0 mt-6 lg:pb-36 pb-10 lg:rounded-2xl lg:px-8 px-4 lg:border border-gray26 lg:bg-gray9"
      >
        <div className="w-full flex justify-center items-center flex-col">
          <StepperComponent currentStep={1} />

          <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
            ایمیل خود را وارد کنید
          </p>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                label="ایمیل"
                type="text"
                error={errors.email?.message}
                {...field}
                labelBgClass="bg-gray9"
              />
            )}
          />

          <button
            type="submit"
            className="lg:mt-22 mt-12 mb-80 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
          >
            ارسال کد تایید
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div
            className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center flex-row-reverse justify-between">
              <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
                تایید ایمیل
              </h2>
              <span
                className="icon-wrapper h-6 w-6 cursor-pointer"
                onClick={handleCloseModal}
              >
                <IconClose />
              </span>
            </div>

            <p className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24" dir="rtl">
              لطفا کد ارسالی به ایمیل زیر را وارد کنید: {emailValue}
            </p>

            <div className="mt-[32px] mb-[48px]">
              <OTPModal
                length={5}
                onChange={(code) => console.log("کد وارد شده:", code)}
              />
            </div>

            <div className="flex gap-2 mb-8">
              <button
                onClick={handleCloseModal}
                className="mt-4 w-[180px] h-[48px] border border-blue2 rounded-lg text-blue2 text-sm lg:text-medium"
              >
                ویرایش ایمیل
              </button>
              <Link to={""}>
                <button
                  onClick={handleCloseModal}
                  className="mt-4 w-[200px] h-[48px] font-bold bg-blue2 text-white1 rounded-lg "
                >
                  تایید
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
