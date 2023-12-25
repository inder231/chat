import { VStack, ButtonGroup, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
const Signup = () => {
  const navigate = useNavigate();
  const {setUser} = useContext(AccountContext);
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
        actions.resetForm();
        fetch("http://localhost:4000/auth/signup", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vals),
        })
          .catch((err) => {
            return;
          })
          .then((res) => {
            if (!res || !res.ok || res.status >= 400) {
              return;
            }
            return res.json();
          })
          .then((data) => {
            if (!data) return;
            setUser({...data});
            navigate("/home");
          });
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
        <Heading>Sign Up</Heading>
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
            Sign Up
          </Button>
          <Button onClick={() => navigate("/")} leftIcon={<ArrowBackIcon />}>
            {" "}
            Back
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Signup;
