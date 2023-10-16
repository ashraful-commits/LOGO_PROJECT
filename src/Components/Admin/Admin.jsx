import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab } from "@mui/material";
import { useState } from "react";
import User from "../Users/User";
import AllPosts from "../AllPost/AllPost";

//============== The Admin component provides a tabbed interface for managing users and posts.
const Admin = () => {
  //================= State to manage the currently selected tab.
  const [value, setValue] = useState("1");
  //==================== Function to handle tab change.
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container sx={{ width: "100%", minHeight: "50vh" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {/*======== TabList for switching between Users and Posts tabs. */}
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Users" value="1" />
            <Tab label="Posts" value="2" />
          </TabList>
        </Box>
        {/*============ TabPanel for displaying the selected content based on the active tab. */}
        <TabPanel value="1">
          <Box>
            {/*============ Render the User component within the Users tab. */}
            <User />
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <Box>
            {/*============ Render the AllPosts component within the Posts tab. */}
            <AllPosts />
          </Box>
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default Admin;
