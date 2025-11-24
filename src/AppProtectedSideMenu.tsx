import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { routeEnum } from "./constants/RouteConstants";
import theme from "../mui.config";
import SportygalaxyLogo from "/sportygalaxy-logo.svg";
import {
  ChevronUp,
  Container,
  CreditCardShield,
  Home03,
  LogOut01,
  MessageChatSquare,
  SearchLg,
  Settings01,
  Users01,
} from "@untitled-ui/icons-react";
import useLogout from "./hooks/useLogout";

type Props = {
  className?: string;
};

type LinkType = {
  title: string;
  icon: React.ReactNode;
  path: string | null;
  isAccordion?: boolean;
};
type AccordionLinkType = {
  title: string;
  icon: React.ReactNode;
  subLinks: LinkType[];
  isAccordion?: boolean;
};

// Define a union type that includes both LinkType and AccordionLinkType
type CombinedLinkType = LinkType | AccordionLinkType;

const NORMAL_LINKS: LinkType[] = [
  {
    title: "Dashboard",
    icon: <Home03 />,
    path: routeEnum.DASHBOARD,
  },
  {
    title: "Reviews",
    icon: <MessageChatSquare />,
    path: routeEnum.REVIEWS,
  },
  {
    title: "Orders",
    icon: <Container />,
    path: routeEnum.ORDERS,
  },
  {
    title: "Transactions",
    icon: <CreditCardShield />,
    path: routeEnum.TRANSACTIONS,
  },
];

const BOTTOM_LINKS: LinkType[] = [
  {
    title: "Settings",
    icon: <Settings01 />,
    path: routeEnum.SETTINGS,
  },
  {
    title: "Log out",
    icon: <LogOut01 />,
    path: null,
  },
];

const ACCORDION_LINKS: AccordionLinkType[] = [
  {
    title: "Products",
    icon: <SearchLg color="black" />,
    subLinks: [
      {
        title: "Products",
        icon: <></>,
        path: routeEnum.PRODUCTS,
      },
      {
        title: "Colors",
        icon: <></>,
        path: routeEnum.PRODUCT_COLORS,
      },
      {
        title: "Sizes",
        icon: <></>,
        path: routeEnum.PRODUCT_SIZES,
      },
    ],
    isAccordion: true,
  },
  {
    title: "Users",
    icon: <Users01 color="black" />,
    subLinks: [
      {
        title: "Clients",
        icon: <></>,
        path: routeEnum.USERS_CLIENTS,
      },
      {
        title: "Employees",
        icon: <></>,
        path: routeEnum.USERS_EMPLOYEES,
      },
    ],
    isAccordion: true,
  },
];

const NavLinkItem = ({ title, icon, path, isAccordion }: LinkType) => {
  const { logout } = useLogout();

  const defaultClass = `flex items-center w-full py-3 px-3 ${
    isAccordion ? "mb-0" : "mb-5"
  }`;
  return (
    <>
      {path ? (
        <NavLink
          to={path}
          className={({ isActive }) =>
            isActive
              ? `${defaultClass} rounded-lg bg-[#A6F4C5] bg-${theme.palette.primary.main}`
              : defaultClass
          }
        >
          {icon}
          <span className="ml-3 text-base font-medium text-black capitalize font-inter">
            {title}
          </span>
        </NavLink>
      ) : (
        <div onClick={logout} className={`${defaultClass} cursor-pointer`}>
          {icon}
          <span className="ml-3 text-base font-medium text-black capitalize font-inter">
            {title}
          </span>
        </div>
      )}
    </>
  );
};

const NavAccordion = ({ title, icon, subLinks }: AccordionLinkType) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      sx={{
        background: "transparent",
        boxShadow: "none",
        border: "none",
        marginBottom: "20px",
      }}
      expanded={expanded}
      onChange={handleChange}
    >
      <AccordionSummary
        className="!px-3 !py-0"
        expandIcon={
          expanded ? (
            <span>
              <ChevronUp />
            </span>
          ) : (
            <span>
              <ChevronUp />
            </span>
          )
        }
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-3 text-base font-medium text-black capitalize font-inter">
            {title}
          </span>
        </div>
      </AccordionSummary>
      <AccordionDetails className="bg-[#FFFFFF4A] !pb-[1px] flex flex-col items-center justify-start gap-2 mb-4 rounded-b-xl">
        {subLinks.map(({ icon, title, path }) => (
          <NavLinkItem
            key={title}
            title={title}
            icon={icon}
            path={path}
            isAccordion
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

const AppProtectedSideMenu: React.FC<Props> = ({ className = "" }) => {
  // Combine normal links and accordion links
  const COMBINED_LINKS: CombinedLinkType[] = [
    ...NORMAL_LINKS.slice(0, 1), // "Dashboard"
    ...ACCORDION_LINKS, // Insert "Users" and "Products" accordion link here
    ...NORMAL_LINKS.slice(1), // "Review" and "Other links"
  ];

  // Type guard to check if the link is an AccordionLinkType
  const isAccordionLink = (
    link: CombinedLinkType
  ): link is AccordionLinkType => {
    return (link as AccordionLinkType).subLinks !== undefined;
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
      }}
      className={`fixed z-[1000] top-0 left-0 pt-[40px] pb-[30px] px-[30px] h-[100svh] flex flex-col item-center justify-between sm:!static ${className} bg-grey-100 xl:min-w-[300px] w-full`}
    >
      {/* Top section with logo and links */}
      <div>
        <div>
          <Link to={routeEnum.DASHBOARD}>
            <img src={SportygalaxyLogo} alt="logo" />
          </Link>
        </div>
        <nav className="pt-[50px]">
          {COMBINED_LINKS.map((link, index) =>
            isAccordionLink(link) ? (
              <NavAccordion key={index} {...link} />
            ) : (
              <NavLinkItem key={index} {...link} />
            )
          )}
        </nav>
      </div>

      {/* Bottom section with settings and logout */}
      <div>
        <nav className="pt-4">
          {BOTTOM_LINKS.map((link, index) => (
            <NavLinkItem key={index} {...link} />
          ))}
        </nav>
      </div>
    </Box>
  );
};

export default AppProtectedSideMenu;
