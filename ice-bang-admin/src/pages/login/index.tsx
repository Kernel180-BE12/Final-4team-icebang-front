import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<img src={"../../../favicon.png"} alt="Soft labs logo" style={{ height: 64 }} />}
      formProps={{
        initialValues: { email: "admin@icebang.site", password: "qwer1234!A" },
      }}
    />
  );
};
