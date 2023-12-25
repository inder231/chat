import { VStack, ButtonGroup, Button, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AccountContext } from "../context/AccountContext";
const Login = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setUser } = useContext(AccountContext) as any;
  const [error, setError] = useState(null);

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required("Username required.")
          .min(6, "Username too short")
          .max(28, "Username too long"),
        password: Yup.string()
          .required("Password required.")
          .min(6, "Password too short")
          .max(28, "Password too long"),
      })}
      onSubmit={(values, actions) => {
        const vals = { ...values };
        fetch("http://localhost:4000/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vals),
        })
          .then((res) => {
            if (!res || !res.ok || res.status >= 400) {
              return;
            }
            return res.json();
          })
          .then((data) => {
            if (!data) return;
            setUser({ ...data });
            navigate("/home");
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {});
        actions.resetForm();
      }}
    >
      <VStack
        as={Form}
        w={{ base: "90%", md: "500px" }}
        m="auto"
        h={{ base: "100vh" }}
        justify="center"
        align="center"
      >
        <Heading>Log In</Heading>
        <Text as="p" color="red.400">
          {error}
        </Text>
        <TextField
          name="username"
          placeholder="Enter username..."
          autoComplete="off"
          label="Username"
        />
        <TextField
          name="password"
          placeholder="Enter password..."
          autoComplete="off"
          label="Password"
          type="password"
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Log In
          </Button>
          <Button onClick={() => navigate("/register")}>Create Account!</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Login;
