import React from "react";

const ErrorDisplayer = (props) => {
  const { msg } = props;
  console.log(msg);
  return <h3>{msg || "path not found"}</h3>;
};

export default ErrorDisplayer;
