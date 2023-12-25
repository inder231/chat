import {
  VStack,
  ButtonGroup,
  Button,
  Heading,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const navigate = useNavigate();
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
        alert(JSON.stringify(values));
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
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Log In
          </Button>
          <Button onClick={()=>navigate("/register")}>Create Account!</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Login;
