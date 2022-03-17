import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { lime } from "@mui/material/colors";

export const ChallengeDashboardPlayerTag = ({
  colorBadge,
  isTurn,
  children,
}) => {
  return (
    <div>
      <List dense sx={isTurn ? { bgcolor: lime[100] } : {}}>
        <ListItem>
          <ListItemIcon>{colorBadge}</ListItemIcon>
          <ListItemText disableTypography primary={children} />
        </ListItem>
      </List>
    </div>
  );
};
