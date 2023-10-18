import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import { useState } from "react";
import User from "../Users/User";
import AllPosts from "../PenddingPosts/AllPost";

//============== The Admin
const Admin = () => {
  //================= States
  const [value, setValue] = useState("1");
  //==================== handleChange value
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container
      sx={{
        width: "90vw",
        minHeight: "50vh",
        overflow: "auto",
        margin: "0 auto",
        boxShadow: "0 0 10px #dcdcdb",
      }}
    >
      <TabContext sx={{ width: "100%" }} value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {/*======== TabList  */}
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Users" value="1" />
            <Tab label="Posts" value="2" />
          </TabList>
        </Box>
        {/*============ TabPanel for displaying the selected content based on the active tab. */}
        <TabPanel value="1">
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            {/*============ Render the User component within the Users tab. */}
            <User />
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            {/*============ Render the AllPosts component within the Posts tab. */}
            <AllPosts />
          </Box>
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default Admin;
