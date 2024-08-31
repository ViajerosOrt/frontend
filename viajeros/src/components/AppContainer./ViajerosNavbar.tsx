import { AppShell, Stack, NavLink } from "@mantine/core"
import { IoIosAirplane, IoMdSettings } from "react-icons/io"
import { MdCardTravel } from "react-icons/md"

export function ViajerosNavbar({ closeSidebar }: { closeSidebar: () => void }) {
  const primaryLinks: Array<any> = [
    {
      to: '/viajes',
      label: 'Viajes',
      leftSection: <IoIosAirplane />
    },
    {
      to: '/misViajes',
      label: 'Mis viajes',
      leftSection: <MdCardTravel />
    },
    {
      to: '/configuracion',
      label: 'Configuracion',
      leftSection: <IoMdSettings />
    }
  ]

  return (
    <AppShell.Section>
      <Stack gap={0}>
        {primaryLinks.map((link, index) => (
          <ViajerosNavLink
            key={`${link.label}-${index}`}
            to={link.to}
            label={link.label}
            leftSection={link.leftSection}
            onClick={() => {
              closeSidebar()
              link.onClick && link.onClick()
            }}
          />
        ))}
      </Stack>
    </AppShell.Section>
  )
}

type navLink = {
  to?: string
  label: string
  leftSection: React.ReactNode
  onClick?: () => void
}

function ViajerosNavLink({
  to,
  label,
  leftSection,
  onClick }: navLink) {

  return (
    <NavLink
      href={to}
      label={label}
      leftSection={leftSection}
      onClick={() => onClick?.()}
    />
  )
}