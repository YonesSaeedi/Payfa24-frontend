export type GetUserResponse = {
  status: boolean;
  msg: string;
  user: GetUser;
};
export type GetUser = {
  id: number;
  name: string;
  name_display: string;
  family: string;
  email: string;
  mobile: string;
  national_code: string;
  profile_img: string | null;
  date_register: string;
  level_account: number;
  level_kyc: string;
};
