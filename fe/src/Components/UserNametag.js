import Typography from "@mui/material/Typography";

export default function UserNametag({ displayName }) {
  return (
    <Typography
      sx={{
        fontFamily: "Inconsolata",
        fontWeight: 700,
        fontSize: 18,
      }}
    >
      {"Guest #" + displayName.slice(0, 7)}
    </Typography>
  );
}
