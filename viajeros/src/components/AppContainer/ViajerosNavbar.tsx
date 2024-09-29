import { AppShell, Stack, NavLink } from "@mantine/core";
import { IoIosAirplane, IoMdSettings } from "react-icons/io";
import { MdCardTravel } from "react-icons/md";
import Link from "next/link";
import { URL } from "url";

export function ViajerosNavbar({ closeSidebar }: { closeSidebar: () => void }) {
  const primaryLinks: Array<any> = [
    {
      to: "/travels",
      label: "travels",
      leftSection: <IoIosAirplane />,
    },
    {
      to: "/myTravels",
      label: "My travels",
      leftSection: <MdCardTravel />,
    },
    {
      to: "/settings",
      label: "Settings",
      leftSection: <IoMdSettings />,
    },
  ];

  return (
    <AppShell.Section>
      <Stack gap={0}>
        {primaryLinks.map((link, index) => (
          <ViajerosNavLink
            key={`${link.label}-${index}`}
            to={link.to as URL}
            label={link.label}
            leftSection={link.leftSection}
            onClick={() => {
              closeSidebar();
              link.onClick && link.onClick();
            }}
          />
        ))}
      </Stack>
    </AppShell.Section>
  );
}

type navLink = {
  to: URL;
  label: string;
  leftSection: React.ReactNode;
  onClick?: () => void;
};

function ViajerosNavLink({ to, label, leftSection, onClick }: navLink) {
  return (
    <NavLink
      href={to}
      component={Link}
      label={label}
      leftSection={leftSection}
      onClick={() => onClick?.()}
    />
  );
}
