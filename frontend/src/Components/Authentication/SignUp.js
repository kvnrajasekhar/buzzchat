/* eslint-disable no-unused-vars */
import React from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [cnfShow, setCnfShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const toast = useToast();
  const postDetails = (pics) => {
    setLoading(true);
    console.log(pics);
    if (pics === undefined) {
      toast({
        title: "Please Select An Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "daspplhqg");
      fetch("https://api.cloudinary.com/v1_1/daspplhqg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select An Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const submitHandler = async () => {
    if (!name || !password || !confirmPass || !email) {
      toast({
        title: "Please Fill All Details",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPass) {
      toast({
        title: "Password & Confirm Password don't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/",
        { name, email, password, pic },
        config
      );
      console.log(data);
      toast({
        title: "Email Sent",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      console.log("Email Sent ");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPass("");
      setPic("");
      // history.push("/chats");
      history.push("/");
    } catch (err) {
      toast({
        title: "Error Occured",
        status: "warning",
        description: err.response.data.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired style={{ marginBottom: "5px" }}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your Name Here"
          onChange={(ev) => {
            setName(ev.target.value);
          }}
          value={name}
        />
      </FormControl>
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
      <FormControl style={{ marginBottom: "5px" }} id="cnfpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={cnfShow ? "text" : "password"}
            placeholder="Re-Enter Your Password Here"
            onChange={(ev) => {
              setConfirmPass(ev.target.value);
            }}
            value={confirmPass}
          />
          <Button
            h="1.75rem"
            size="sm"
            bgColor={"white"}
            m={"1"}
            onClick={() => {
              setCnfShow(!cnfShow);
            }}
          >
            {cnfShow ? "Hide" : "Show"}
          </Button>
        </InputGroup>
      </FormControl>
      <FormControl style={{ marginBottom: "5px" }} id="pic">
        <FormLabel>Profile Pic</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1}
          placeholder="Enter Your Name Here"
          onChange={(ev) => {
            postDetails(ev.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        onClick={submitHandler}
        style={{ marginTop: "15px" }}
        isLoading={loading}
      >
        SignUp
      </Button>
    </VStack>
  );
};

export default SignUp;
