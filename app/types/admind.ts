export interface admindCreateType {
  name: string;
  email: string;
  middle_name: string;
  last_name: string;
  birthdate: string;
  phone: string;
  password?: string;
  password2?: string;
}
export interface admindUpdateType {
  name: string;
  email: string;
  middle_name: string;
  last_name: string;
  birthdate: string;
  phone: string;
}
export interface admindListType {
  id_user: number;
  user_type: string;
  name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  birthdate: string;
  email: string;
  status: string;
}
