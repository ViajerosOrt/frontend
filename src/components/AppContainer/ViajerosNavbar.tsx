import { AppShell, Stack, NavLink } from "@mantine/core";
import { IoIosAirplane, IoMdSettings } from "react-icons/io";
import { MdCardTravel } from "react-icons/md";
import Link from "next/link";
import { URL } from "url";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { VIAJERO_GREEN, VIAJERO_GREEN_DARK } from "../../consts/consts";
import React from "react";

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
      bg={isActive ? VIAJERO_GREEN_DARK : VIAJERO_GREEN}
      href={to}
      component={Link}
      label={label}
      active={isActive}
      variant="filled"
      leftSection={<div style={{ marginTop: '10px' }}>
      {leftSection} {}
    </div>}
      style={{ 
        borderRadius: 10,
        fontSize: "1.8rem",
        fontWeight: 750,
        transition: "all 0.3s ease-in-out",
        padding: "15px 5px",
        marginBottom: "10px",
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
