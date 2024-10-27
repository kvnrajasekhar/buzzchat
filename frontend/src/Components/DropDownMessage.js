
import React from "react";
import { Select } from "@chakra-ui/react";

const DropDownMessage = () => {
  return (
    <div>
      <Select placeholder="Select an option">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
    </div>
  );
};

export default DropDownMessage;
