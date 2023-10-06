// Import necessary dependencies
import { Outlet } from "react-router-dom"; // Outlet is used for nested routing
import Header from "../Header/Header"; // Import the Header component
import styled from "styled-components"; // Import styled-components for styling

// Define the Layout component responsible for creating the overall app layout.
const Layout = () => {
  return (
    <Container>
      {/* Create a container div to structure the layout */}
      <div className="container">
        {/* Include the Header component for the application's top navigation */}
        <Header />
        {/* Render the content within the Outlet to handle nested routes */}
        <Outlet />
      </div>
    </Container>
  );
};

// Define the Container styled component responsible for styling the layout.
const Container = styled.div`
  // Set the width to 99% of the viewport width for responsive design
  width: 99vw;

  // Set a minimum height of 100% of the viewport height for full coverage
  min-height: 100vh;

  // Allow the max height to adjust to the content's size
  max-height: fit-content;

  // Set the background color to white (customize as needed)
  background-color: #fff;

  // Utilize flex to horizontally center the layout content
  display: flex;
  justify-content: center;

  // Media queries for responsive design
  @media (max-width: 768px) {
    width: 100%; // Use full width for smaller screens
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%; // Use full width for medium-sized screens
  }
`;

// Export the Layout component as the default export for use in the app.
export default Layout;
