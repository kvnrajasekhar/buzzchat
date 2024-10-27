/* eslint-disable no-unused-vars */
import React from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { set } from "mongoose";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      window.location.reload();
      history.push("/chat");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const getUserCredentialsHandler = () => {
    setEmail("guest@example.com");
    setPassword("123456");
  };
  return (
    <VStack className="login-container" spacing="5px">
      <FormControl style={{ marginBottom: "5px" }} id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Here"
          onChange={(ev) => {
            setEmail(ev.target.value);
          }}
          value={email}
        />
      </FormControl>
      <FormControl style={{ marginBottom: "5px" }} id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password Here"
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
            value={password}
          />
          <Button
            h="1.75rem"
            size="sm"
            bgColor={"white"}
            m={"1"}
            onClick={() => {
              setShow(!show);
            }}
          >
            {show ? "Hide" : "Show"}
          </Button>
        </InputGroup>
      </FormControl>
      <div style={{ marginLeft: "-330px", marginBottom: "5px" }}>
        <Link to="/forgotpassword">Forgot Passoword?</Link>
      </div>
      <Button
        colorScheme="blue"
        width="100%"
        onClick={submitHandler}
        style={{ marginTop: "15px" }}
        isLoading={loading}
      >
        LogIn
      </Button>
      {/* <Button
        colorScheme="red"
        width="100%"
        onClick={getUserCredentialsHandler}
        style={{ marginTop: "15px" }}
      >
        Get Guest User Credentials
      </Button> */}
    </VStack>
  );
};

export default Login;
