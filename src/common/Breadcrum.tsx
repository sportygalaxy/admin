// import Box from "@mui/material/Box";
// import List from "@mui/material/List";
import Link, { LinkProps } from "@mui/material/Link";
import { ListItemProps } from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  Link as RouterLink,
  // useLocation
} from "react-router-dom";
import { DotsHorizontal, Expand01 } from "@untitled-ui/icons-react";

export interface BreadcrumbItem {
  path: string;
  label: string;
  disabled?: boolean;
}

interface ReusableBreadcrumbProps {
  breadcrumbItems: BreadcrumbItem[];
}

interface ListItemLinkProps extends ListItemProps {
  to: string;
  open?: boolean;
}

export function ListItemLink(props: ListItemLinkProps) {
  const { to, open, ...other } = props;
  const primary = other.children;

  let icon: React.ReactNode = null;
  if (open != null) {
    icon = open ? <Expand01 /> : <DotsHorizontal />;
  }

  return (
    <li>
      <ListItemButton component={RouterLink as any} to={to} {...other}>
        <ListItemText primary={primary} />
        {icon}
      </ListItemButton>
    </li>
  );
}

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

function LinkRouter(props: LinkRouterProps) {
  return <Link {...props} component={RouterLink as any} />;
}

export function Breadcrumb({ breadcrumbItems }: ReusableBreadcrumbProps) {
  // const location = useLocation();
  // const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {/* <LinkRouter underline="hover" color="inherit" to="/">
        Home
      </LinkRouter> */}
      {breadcrumbItems.map((item, index) => {
        const last = index === breadcrumbItems.length - 1;
        const to = item.path;

        if (item.disabled) {
          return (
            <Typography color="grey.500" key={to}>
              {item.label}
            </Typography>
          );
        }

        return last ? (
          <Typography
            className="text-sm font-medium font-inter"
            color="grey.500"
            key={to}
          >
            {item.label}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="grey.500" to={to} key={to}>
            {item.label}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
}

// export default function BreadcrumbWrapper() {
//   // Example usage
//   const breadcrumbItems: BreadcrumbItem[] = [
//     { path: "/users", label: "Users", disabled: true },
//     { path: "/users/agents", label: "Agents" },
//     { path: "/users/clients", label: "Clients" },
//   ];

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", width: 360 }}>
//       <Breadcrumb breadcrumbItems={breadcrumbItems} />
//       <Box
//         sx={{
//           bgcolor: "background.paper",
//         }}
//         component="nav"
//         aria-label="nav links"
//       >
//         <List disablePadding>
//           <ListItemLink to="/users/agents">Agents</ListItemLink>
//           <ListItemLink to="/users/clients">Clients</ListItemLink>
//         </List>
//       </Box>
//     </Box>
//   );
// }
