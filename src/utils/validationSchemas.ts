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
  return yup.object().shape({
    email: emailValidation(
      "ایمیل یا شماره همراه الزامی است.",
      "ورودی نامعتبر است. لطفاً ایمیل یا شماره تلفن معتبر وارد کنید.",
      "ایمیل وارد شده معتبر نیست.",
      "شماره تلفن وارد شده معتبر نیست.",
      "ایمیل باید شامل دامنه معتبر (مثل .com یا .ir) باشد."
    ),
    password: yup
      .string()
      .required("رمز عبور الزامی است.")
      .matches(
        /^.{6,}$/,
        "رمز عبور باید حداقل ۸ کاراکتر باشد."
      ),
  });
};




// schema برای صفحه ForgotPassword
export const getForgotPasswordSchema = () => {
  return yup.object().shape({
    email: emailValidation(
      "لطفا ایمیل یا شماره همراه خود را وارد کنید.",
      "لطفاً ایمیل یا شماره تلفن معتبر وارد کنید.",
      "ایمیل وارد شده معتبر نیست.",
      "شماره تلفن وارد شده معتبر نیست.",
      "ایمیل باید شامل دامنه معتبر (مثل .com یا .ir) باشد."
    ),
  });
};


// schema برای صفحه StepInvite
export const getStepInviteSchema = () => {
  return yup.object().shape({
    email: emailValidation(
      "ایمیل یا شماره همراه الزامی است.",
      "فرمت ایمیل یا شماره همراه معتبر نیست.",
      "ایمیل وارد شده معتبر نیست.",
      "شماره تلفن وارد شده معتبر نیست.",
      "ایمیل باید شامل دامنه معتبر (مثل .com یا .ir) باشد."
    ),
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
  return yup.object().shape({
    contactType: yup.string().required("نوع تماس الزامی است."),
    contactValue: yup
      .string()
      .required("مقدار تماس الزامی است.")
      .when("contactType", {
        is: "email",
        then: (schema) => schema.email("ایمیل معتبر نیست."),
        otherwise: (schema) =>
          schema.matches(/^09\d{9}$/, "شماره موبایل معتبر نیست."),
      }),
  });
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
      .min(500000, "حداقل مبلغ واریز ۵۰۰,۰۰۰ تومان است")
      .max(25000000, "حداکثر مبلغ واریز ۲۵,۰۰۰,۰۰۰ تومان است"),
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