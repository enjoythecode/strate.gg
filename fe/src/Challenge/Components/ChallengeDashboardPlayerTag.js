import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const ChallengeDashboardPlayerTag = ({
  colorBadge,
  displayName,
  children,
}) => {
  return (
    <div>
      <List dense>
        <ListItem>
          <ListItemIcon>{colorBadge}</ListItemIcon>
          <ListItemText disableTypography primary={children} />
        </ListItem>
      </List>
    </div>
  );
};
