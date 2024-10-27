
import { useState } from "react";
import React from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button, flexbox } from "@chakra-ui/react";
import { useToast, Box, Text } from "@chakra-ui/react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitHandler = async () => {
    setLoading(true);
    if (!email) {
      toast({
        title: "Please Fill all the Fields",
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
        `/api/user/forgot-password`,
        { email },
        config
      );
      toast({
        title: "Password Reset Email Sent",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      console.error("Password reset failed:", error.message);
      toast({
        title: "Password Reset Failed",
        description: "An error occurred while sending the reset email.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          bg="white"
          w="35%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
          textAlign={"center"}
        >
          <Text fontSize="4xl" fontFamily="Work sans" color="black">
            Let's Talk
          </Text>
        </Box>
        <VStack
          spacing="5px"
          background="white"
          padding="30px"
          width="35%"
          borderRadius="10px"
        >
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
          <Button
            colorScheme="blue"
            width="100%"
            onClick={submitHandler}
            style={{ marginTop: "15px" }}
            isLoading={loading}
          >
            Reset Password
          </Button>
        </VStack>
      </div>
    </>
  );
};

export default ForgotPassword;
