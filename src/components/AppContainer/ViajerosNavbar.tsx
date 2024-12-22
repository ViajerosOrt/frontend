import { AppShell, Stack, NavLink } from "@mantine/core";
import { IoIosAirplane } from "react-icons/io";
import { MdCardTravel, MdMessage } from "react-icons/md";
import Link from "next/link";
import { URL } from "url";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CgProfile } from "react-icons/cg";
import { VIAJERO_GREEN, VIAJERO_GREEN_DARK } from "../../consts/consts";
import React from "react";
import { IoBook } from "react-icons/io5";

export function ViajerosNavbar({ closeSidebar }: { closeSidebar: () => void }) {
  const router = useRouter();
  const [activeLabel, setActiveLabel] = useState('')

  const primaryLinks: Array<any> = [
    {
      to: "/travels",
      label: "Travels",
      leftSection: <IoIosAirplane />,
    },
    {
      to: "/myTravels",
      label: "My travels",
      leftSection: <MdCardTravel />,
    },
    {
      to: "/chats",
      label: "Chats",
      leftSection: <MdMessage />,
    },
    {
      to: "/reviews",
      label: "Reviews",
      leftSection: <IoBook />,
    },
    {
      to: "/profile",
      label: "Profile",
      leftSection: <CgProfile />,
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
      bg={isActive ? VIAJERO_GREEN_DARK : VIAJERO_GREEN}
      href={to}
      component={Link}
      label={label}
      active={isActive}
      variant="filled"
      leftSection={<div style={{ marginTop: '10px' }}> {leftSection} { }
      </div>}
      px={15}
      py={25}
      fw={750}
      mb={10}
      style={{
        borderRadius: 10,
        fontSize: "1.8rem",
        transition: "all 0.3s ease-in-out",
        gap: "5px",
      }}
      draggable="false"
      onMouseEnter={(e) => {
        const target = e.target as HTMLElement;
        target.style.transform = "scale(1.13)";
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLElement;
        target.style.transform = "scale(1)";
      }}

      onClick={() => onClick?.()}
    />
  );
}
