export interface User {
  id_user: number;
  status: string;
  user_type: string;
  name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthdate: string;
}
export interface UserByphoneType {
  id_user: number;
  name: string;
  middle_name: string;
  last_name: string;
}
export interface LoginType {
  email: string;
  password: string;
}
export interface UpdateUsertype {
    name: string;
    middle_name: string | undefined;
    last_name: string;
    email: string;
    phone: string;
    birthdate: string;
}
