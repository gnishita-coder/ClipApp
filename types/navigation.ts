export type RootStackParamList = {
  Login: undefined;
  Otp: { phone: string };
  Home: undefined;
  CarSelection: undefined
  CarDetail: { car: { id: string; image: any } };
};