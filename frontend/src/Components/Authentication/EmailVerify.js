
import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import EmailVerifyImg from "../../animation/email_verify.png";
const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();
  useEffect(() => {
    console.log(param.id);
    console.log("On Email Verify Page");
    const verifyEmailUrl = async () => {
      try {
        setValidUrl(true);
        const data = await axios.get(
          `http://localhost:5000/api/user/${param.id}/verify/${param.token}`
        );
        console.log(data);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);
  return (
    <div>
      {validUrl ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={EmailVerifyImg}
            alt="Email Verify"
            style={{ marginTop: "5%" }}
          />
          <Link to="/">
            <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: "15px" }}
            >
              LogIn
            </Button>
          </Link>
        </div>
      ) : (
        <div>{console.log("Invalid URL")}</div>
      )}
    </div>
  );
};

export default EmailVerify;
