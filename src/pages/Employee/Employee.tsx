import { Breadcrumb, BreadcrumbItem } from "@/common/Breadcrum";
import { routeEnum } from "@/constants/RouteConstants";
import { FC } from "react";
import { EMPLOYEE_TAB } from "./EmployeeConstants";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import BackButton from "@/common/BackButton";
import { Badge, Button, Tab, Tabs, Typography } from "@mui/material";
import { UserPlus02 } from "@untitled-ui/icons-react";
import { urlSearchParamsExtractor } from "@/utils/routeUtils";
import EmployeeTableWrapper from "./EmployeeTableWrapper";
import EmployeePreviewDetails from "./EmployeePreviewDetails";
interface TabItem {
  id: number;
  key: string;
  label: string;
  content: React.ReactNode;
  notifications: number;
}

interface EmployeeProps {}
const Employee: FC<EmployeeProps> = () => {
  const userDetailSnapshot = useSelector(
    (state: any) => state.global.userDetailSnapshot
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const extractedParams = urlSearchParamsExtractor(searchParams, {
    tab: EMPLOYEE_TAB.NONE,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { path: routeEnum.USERS, label: "Users", disabled: true },
    { path: routeEnum.USERS_EMPLOYEES, label: "Team" },
  ];

  const tabs: TabItem[] = [
    {
      id: 1,
      key: EMPLOYEE_TAB.NONE,
      label: "All",
      notifications: 0,
      content: <EmployeeTableWrapper />,
    },
  ];

  const currentTabIndex = tabs.findIndex(
    (tab) => tab.key === extractedParams.tab
  );

  const handleChangeTabParams = (tabKey: string) => {
    setSearchParams({ tab: tabKey });
  };

  return (
    <div className="container-wrapper py-[30px] h-[calc(100vh-118.5px)]">
      <div className="flex items-end justify-between">
        <div className="space-y-5">
          <BackButton />
          <div>
            <Breadcrumb breadcrumbItems={breadcrumbItems} />
            <Typography
              color="grey.900"
              className="font-bold text-2xl font-crimson"
            >
              Team
            </Typography>
          </div>
        </div>
        <Button
          disabled
          variant="contained"
          startIcon={<UserPlus02 width={20} height={20} />}
          className="capitalize font-bold font-inter"
          size="large"
        >
          Add New Team Member
        </Button>
      </div>

      <div className="mt-10">
        <Tabs
          value={currentTabIndex === -1 ? 0 : currentTabIndex}
          variant="scrollable"
          scrollButtons={false}
          aria-label="team tabs"
        >
          {tabs.map((tab) => (
            <Tab
              className="capitalize"
              key={tab.key}
              onClick={() => handleChangeTabParams(tab.key)}
              label={
                <Badge
                  badgeContent={
                    tab?.notifications > 0 ? tab?.notifications : null
                  }
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "error.600",
                      color: "white",
                      fontSize: "12px",
                      fontFamily: "Inter",
                      fontWeight: 400,
                      position: "relative",
                      top: 8,
                      right: 6,
                      borderRadius: "50%",
                    },
                  }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {tab.label}
                </Badge>
              }
            />
          ))}
        </Tabs>

        <div>{tabs?.[currentTabIndex]?.content}</div>
      </div>
    </div>
  );

  return (
    <div className="container-wrapper py-[30px] h-[calc(100vh-118.5px)]">
      <div className="grid grid-cols-8">
        <div className={cn("col-span-8", userDetailSnapshot && "col-span-6")}>
          <div className="flex items-end justify-between">
            <div className="space-y-5">
              <BackButton />
              <div>
                <Breadcrumb breadcrumbItems={breadcrumbItems} />
                <Typography
                  color="grey.900"
                  className="font-bold text-2xl font-crimson"
                >
                  Employees
                </Typography>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<UserPlus02 width={20} height={20} />}
              className="capitalize font-bold font-inter"
              size="large"
              disabled
            >
              Add New Employee
            </Button>
          </div>

          <div className="mt-10">
            <Tabs
              value={currentTabIndex === -1 ? 0 : currentTabIndex}
              variant="scrollable"
              scrollButtons={false}
              aria-label="employee tabs"
            >
              {tabs.map((tab) => (
                <Tab
                  className="capitalize"
                  key={tab.id}
                  onClick={() => handleChangeTabParams(tab.key)}
                  label={
                    <Badge
                      badgeContent={
                        tab?.notifications > 0 ? tab?.notifications : null
                      }
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "error.600",
                          color: "white",
                          fontSize: "12px",
                          fontFamily: "Inter",
                          fontWeight: 400,
                          position: "relative",
                          top: 8,
                          right: 6,
                          borderRadius: "50%",
                        },
                      }}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      {tab.label}
                    </Badge>
                  }
                />
              ))}
            </Tabs>

            <div>{tabs?.[currentTabIndex]?.content}</div>
          </div>
        </div>

        {userDetailSnapshot ? (
          <div className="col-span-2 ml-6">
            <EmployeePreviewDetails />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Employee;
