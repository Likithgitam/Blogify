import React from "react";

const UserContext = React.createContext({
  user: { _id: "", username: "", email: "" },
  setUser: () => {},
});

export default UserContext;
