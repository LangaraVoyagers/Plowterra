import { Box, Button } from "@mui/material";

import BasicHome from "layouts/BasicHome";

const Pickers = () => {
  return (
    <BasicHome
      title="Pickers"
      subtitle="Add and view picker’s profile and information here."
      breadcumb={[
        { title: "Farm Name", href: "#" },
        { title: "Pickers", href: "" },
      ]}
      actions={<Button variant="contained">Add New Picker</Button>}
    >
      <Box></Box>
    </BasicHome>
  );
};

export default Pickers;
