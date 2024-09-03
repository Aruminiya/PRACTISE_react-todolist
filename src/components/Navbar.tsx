import { AppBar, Box, Toolbar, Link } from '@mui/material';

const links = [
  {
    href: "/",
    title: "首頁"
  }
];

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {links.map(link => <Box key={link.href} margin="0 12px">
            <Link color="white" href={link.href} underline="none">{link.title}</Link>
          </Box>)}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
