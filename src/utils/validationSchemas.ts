// utils/validationSchemas.ts
import * as yup from "yup";

// تابع مشترک برای فیلد email/phone با پارامترهای سفارشی برای پیام‌ها
export const emailValidation = (
  requiredMessage: string,
  invalidInputMessage: string,
  invalidEmailMessage: string,
  invalidPhoneMessage: string,
  invalidDomainMessage: string
) => {
  return yup
    .string()
    .required(requiredMessage)
    .test(
      "email-or-phone",
      invalidInputMessage,
      function (value) {
        if (!value) return false;

        const isPhone = /^(09|\+989)\d{9}$/.test(value);
        const isEmail = yup.string().email().isValidSync(value);

        if (!isEmail && !isPhone) {
          return false;
        }
        return true;
      }
    )
    .test(
      "valid-email",
      invalidEmailMessage,
      function (value) {
        if (!value) return true;
        const isEmail = yup.string().email().isValidSync(value);
        const isPhone = /^(09|\+989)\d{9}$/.test(value);
        if (!isPhone && isEmail) {
          const domainPart = value.split("@")[1];
          if (!domainPart || !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/.test(domainPart)) {
            throw this.createError({ message: invalidDomainMessage });
          }
        }
        return isPhone || isEmail;
      }
    )
    .test(
      "valid-phone",
      invalidPhoneMessage,
      function (value) {
        if (!value) return true;
        const isPhone = /^(09|\+989)\d{9}$/.test(value);
        const isEmail = yup.string().email().isValidSync(value);
        return isEmail || isPhone;
      }
    );
};

// schema برای صفحه Login
export const getLoginSchema = () => {
  return yup.object({
    mobile: yup.string().required("شماره همراه الزامی است"),
    password: yup.string().required("رمز عبور الزامی است"),
  });
};




// ForgotPasswordS
export const getForgotPasswordSchema = () => {
  return yup.object({
    mobile: yup
      .string()
      .required("شماره همراه الزامی است")
      .matches(/^09[0-9]{9}$/, "شماره همراه معتبر نیست"), 
  });
};


// schema برای صفحه StepInvite
export const getStepInviteSchema = () => {
  return yup.object().shape({
    mobile: yup
      .string()
      .required("شماره همراه الزامی است.")
      .matches(/^09[0-9]{9}$/, "شماره همراه معتبر نیست. فرمت صحیح: 09123456789"),
    inviteCode: yup.string().optional(),
  });
};



// schema برای صفحه changePasswordSchema
export const getChangePasswordSchema = () => {
  return yup.object().shape({
    password: yup
      .string()
      .required("رمز عبور الزامی است.")
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.")
      .matches(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد.")
      .matches(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد.")
      .matches(/\d/, "رمز عبور باید حداقل یک عدد داشته باشد."),
  });
};






// schema برای صفحه Contact
export const getContactSchema = () => {
  return yup
    .object()
    .shape({
      contactType: yup
        .mixed<'email' | 'mobile'>()
        .oneOf(['email', 'mobile'] as const, "نوع تماس نامعتبر است.")
        .required("نوع تماس الزامی است."),
      contactValue: yup
        .string()
        .required("مقدار تماس الزامی است.")
        .when("contactType", {
          is: "email",
          then: (schema) => schema.email("ایمیل معتبر نیست."),
          otherwise: (schema) =>
            schema.matches(/^09\d{9}$/, "شماره موبایل معتبر نیست."),
        }),
    })
   
};


export const DepositwithIdentifierSchema = () => yup.object().shape({
    bank: yup.string().required("لطفا حساب بانکی را انتخاب کنید"),
});





export const getValidationSchemaCardtoCard = () => {
  return yup.object().shape({
    amount: yup
      .number()
      .typeError("مبلغ باید عدد باشد")
      .required("وارد کردن مبلغ الزامی است")
      .min(200000, "حداقل مبلغ واریز ۲۰۰٬۰۰۰ تومان است")
      .max(25000000, "حداکثر مبلغ واریز ۲۵٬۰۰۰٬۰۰۰ تومان است"),
    card: yup
      .number()
      .min(1, "لطفاً یک کارت معتبر انتخاب کنید")
      .required("لطفاً یک کارت معتبر انتخاب کنید"),
  });
};



export const getChangePasswordSchemaProfile = () => {
  return yup.object().shape({
    currentPassword: yup
      .string()
      .required("رمز عبور فعلی الزامی است")
      .min(6, "حداقل ۶ کاراکتر"),
    newPassword: yup
      .string()
      .required("رمز عبور جدید الزامی است")
      .min(8, "حداقل ۸ کاراکتر")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "حداقل یک حرف کوچک، بزرگ و عدد"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "تکرار رمز عبور مطابقت ندارد")
      .required("تکرار رمز عبور الزامی است"),
  });
};