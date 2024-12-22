export type LoginRes = {
  errYn: string;
  code: string;
  msg: string;
  data: {
    accessToken: string;
    loginFailCount: string;
  };
};
