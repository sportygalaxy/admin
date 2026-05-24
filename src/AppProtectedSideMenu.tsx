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
import useAuthUser from "./hooks/useAuthUser";
import {
  ROLE_MANAGEMENT_ACCESS_ROLES,
  type UserRole,
} from "./constants/roles";

type Props = {
  className?: string;
  onNavigate?: () => void;
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

const NavLinkItem = ({
  title,
  icon,
  path,
  isAccordion,
  onNavigate,
}: LinkType & { onNavigate?: () => void }) => {
  const { logout } = useLogout();

  const defaultClass = `flex items-center w-full py-3 px-3 ${
    isAccordion ? "mb-0" : "mb-5"
  }`;
  return (
    <>
      {path ? (
        <NavLink
          to={path}
          onClick={onNavigate}
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
        <div
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className={`${defaultClass} cursor-pointer`}
        >
          {icon}
          <span className="ml-3 text-base font-medium text-black capitalize font-inter">
            {title}
          </span>
        </div>
      )}
    </>
  );
};

const NavAccordion = ({
  title,
  icon,
  subLinks,
  onNavigate,
}: AccordionLinkType & { onNavigate?: () => void }) => {
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
            onNavigate={onNavigate}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

const AppProtectedSideMenu: React.FC<Props> = ({
  className = "",
  onNavigate,
}) => {
  const user = useAuthUser();
  const isRoleManager = ROLE_MANAGEMENT_ACCESS_ROLES.includes(
    user?.role as UserRole
  );
  const userAccordionLinks: LinkType[] = [
    {
      title: "Users",
      icon: <></>,
      path: routeEnum.USERS_CLIENTS,
    },
    ...(isRoleManager
      ? [
          {
            title: "Roles",
            icon: <></>,
            path: routeEnum.USERS_ROLES,
          },
        ]
      : []),
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
      subLinks: userAccordionLinks,
      isAccordion: true,
    },
  ];

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
      className={`flex h-full min-h-screen w-full flex-col justify-between bg-grey-100 px-5 pb-6 pt-6 md:px-6 lg:min-h-0 lg:px-[30px] lg:pb-[30px] lg:pt-[40px] xl:min-w-[300px] ${className}`}
    >
      {/* Top section with logo and links */}
      <div>
        <div>
          <Link to={routeEnum.DASHBOARD} onClick={onNavigate}>
            <img src={SportygalaxyLogo} alt="logo" />
          </Link>
        </div>
        <nav className="pt-[50px]">
          {COMBINED_LINKS.map((link, index) =>
            isAccordionLink(link) ? (
              <NavAccordion key={index} {...link} onNavigate={onNavigate} />
            ) : (
              <NavLinkItem key={index} {...link} onNavigate={onNavigate} />
            )
          )}
        </nav>
      </div>

      {/* Bottom section with settings and logout */}
      <div>
        <nav className="pt-4">
          {BOTTOM_LINKS.map((link, index) => (
            <NavLinkItem key={index} {...link} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
    </Box>
  );
};

export default AppProtectedSideMenu;
