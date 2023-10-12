import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import { useState } from "react";
import User from "../Users/User";
import AllPosts from "../AllPost/AllPost";

const Admin = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container sx={{ width: "100%", minHeight: "50vh" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Users" value="1" />
            <Tab label="Posts" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box>
            <User />
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <Box>
            <AllPosts />
          </Box>
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default Admin;
