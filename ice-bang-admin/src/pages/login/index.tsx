import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<img src={"../../../public/favicon.png"} alt="Soft labs logo" style={{ height: 64 }} />}
      formProps={{
        initialValues: { email: "demo@refine.dev", password: "demodemo" },
      }}
    />
  );
};
