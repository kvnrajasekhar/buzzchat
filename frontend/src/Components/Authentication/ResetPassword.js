/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  InputGroup,
  Box,
  Text,
  Container,
} from "@chakra-ui/react";
import axios from "axios";

const ResetPassword = () => {
  const { userId, token } = useParams();
  const toast = useToast();
  const history = useHistory();
  const [newPassword, setNewPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [newShow, setNewShow] = useState(false);
  const [cnfShow, setCnfShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (newPassword !== cnfPassword) {
      toast({
        title: "Confrim Password do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoading(true);
    if (!newPassword || !cnfPassword) {
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
        `/api/user/${userId}/${token}/postResetPassword`,
        { newPassword, cnfPassword },
        config
      );

      toast({
        title: "Password set Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.clear();
      setLoading(false);
      history.push("/");
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

  return (
    <Container maxWidth="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
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
        spacing="35px"
        background="white"
        padding="30px"
        width="100%"
        borderRadius="10px"
      >
        <FormControl style={{ marginBottom: "5px" }} id="password" isRequired>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
            <Input
              type={newShow ? "text" : "password"}
              placeholder="Enter Your New Password Here"
              onChange={(ev) => setNewPassword(ev.target.value)}
              value={newPassword}
            />
            <Button
              h="1.75rem"
              size="sm"
              bgColor={"white"}
              m={"1"}
              onClick={() => {
                setNewShow(!newShow);
              }}
            >
              {newShow ? "Hide" : "Show"}
            </Button>
          </InputGroup>
        </FormControl>
        <FormControl style={{ marginBottom: "5px" }} id="password" isRequired>
          <FormLabel>Confirm New Password</FormLabel>
          <InputGroup>
            <Input
              type={cnfShow ? "text" : "password"}
              placeholder="Confirm New Password"
              onChange={(ev) => setCnfPassword(ev.target.value)}
              value={cnfPassword}
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
        <Button
          colorScheme="blue"
          width="100%"
          onClick={handleReset}
          style={{ marginTop: "15px" }}
          isLoading={loading}
        >
          Reset Password
        </Button>
      </VStack>
    </Container>
  );
};

export default ResetPassword;
