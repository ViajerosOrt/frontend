import { AppShell, Stack, NavLink } from "@mantine/core";
import { IoIosAirplane, IoMdSettings } from "react-icons/io";
import { MdCardTravel } from "react-icons/md";
import Link from "next/link";
import { URL } from "url";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function ViajerosNavbar({ closeSidebar }: { closeSidebar: () => void }) {
  const router = useRouter();
  const [activeLabel, setActiveLabel] = useState('')

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

  useEffect(() => {
    const activeLink = primaryLinks.find(link => link.to === router.pathname);
    if (activeLink) {
      setActiveLabel(activeLink.label);
    }
  }, [router.pathname]);

  return (
    <AppShell.Section>
      <Stack gap={0}>
        {primaryLinks.map((link, index) => (
          <ViajerosNavLink
            key={`${link.label}-${index}`}
            to={link.to as URL}
            label={link.label}
            leftSection={link.leftSection}
            isActive={activeLabel == link.label}
            onClick={() => {
              closeSidebar();
              link.onClick && link.onClick();
              setActiveLabel(link.label)
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
  isActive: boolean,
  onClick?: () => void;
};

function ViajerosNavLink({ to, label, leftSection, onClick, isActive }: navLink) {
  return (
    <NavLink
      bg={isActive ? '#4e8e5a' : '#65a773'}
      href={to}
      component={Link}
      label={label}
      active={isActive}
      variant="filled"
      leftSection={leftSection}
      style={{ borderRadius: 10 }}

      onClick={() => onClick?.()}
    />
  );
}
