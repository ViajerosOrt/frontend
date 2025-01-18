import { useState, useEffect } from 'react';
import { Combobox, Group, Input, CheckIcon, useCombobox, Box, ScrollArea, ActionIcon } from '@mantine/core';
import { TbRotate } from 'react-icons/tb';
import axios from 'axios';
import { useIsMobile } from '@/hooks/useIsMobile';

/*
In charge of fetching and displaying countries with their flags in a Combo Box, uses restcountries Api
https://mantine.dev/combobox/?e=MultiSelectValueRenderer
*/

interface Country {
    value: string;
    label: string;
    flag: string;
}

interface ApiCountry {
    name: { common: string };
    flags: { svg: string };
}

export function Countries({ value, defaultCountry, onChange, disabled = false }: { value: string | null, defaultCountry: string | null, onChange: (val: string | null) => void, disabled: boolean; }) {

    const combobox = useCombobox();
    const [countries, setCountries] = useState<Country[]>([]);
    const [flagsMap, setFlagsMap] = useState<Map<string, string>>(new Map());
    const [search, setSearch] = useState('');
    const { isMobile } = useIsMobile();

    const handleValueSelect = (val: string) => {
        onChange(val);
        setSearch(val);
        combobox.closeDropdown();
    };
 
    //We get the label and flag with restcountries api, then we sort it alphabetically 
    useEffect(() => {
        const getCountries = async () => {
            try {
                const response = await axios.get<ApiCountry[]>('https://restcountries.com/v3.1/all');
                const data = response.data;

                const countriesWithFlags = data.map((country: any) => ({
                    value: country.name?.common,
                    label: country.name?.common,
                    flag: country.flags?.svg,
                })).sort((a, b) => a.label.localeCompare(b.label));

                setCountries(countriesWithFlags);

                const flags = new Map(
                    countriesWithFlags.map((country) => [country.value, country.flag])
                );
                setFlagsMap(flags);

            } catch (error) {
                console.error("Error fetching countries:", error);
            }

        };

        getCountries();
    }, []);

    const selectedFlag = flagsMap.get(value || '');

    const filteredCountries = countries.filter((country) =>
        country.label.toLowerCase().includes(search.toLowerCase())
    );

    //Creates the list of options inside the dropdowm
    const options = filteredCountries.map((country) => (
        <Combobox.Option value={country.value} key={country.value} active={value === country.value} style={{ cursor: 'pointer' }} >
            <Group gap="sm">
                {value && value === country.value && <CheckIcon size={12} />}
                <Group gap={7}>
                    <img src={country.flag} alt={country.value} style={{ width: 20, height: 15 }} />
                    <span>{country.label}</span>
                </Group>
            </Group>
        </Combobox.Option>
    ));

    const handleInputChange = (newValue: string) => {
        if (value) {
            onChange(null);
        }
        setSearch(newValue);
        if (!combobox.dropdownOpened) {
            combobox.openDropdown();
        }
    };

    //ComboBox to display options, we use the DropdownTarget to activate when clicked and Dropshown to show the options
    return (
        <Combobox store={combobox} disabled={disabled} onOptionSubmit={handleValueSelect} withinPortal={false} >
            <Combobox.DropdownTarget>
                <Input
                    value={value || search}
                    onChange={(event) => handleInputChange(event.currentTarget.value)}
                    disabled={disabled}
                    placeholder="Select or search a country"
                    onClick={() => combobox.toggleDropdown()}
                    style={{ width: isMobile ? '250px':'100%', cursor: 'pointer' }}
                    rightSection={value ? (
                        <img src={selectedFlag}
                            alt={value}
                            style={{ width: 50, height: 25 }} />
                    ) : null}
                    />
            </Combobox.DropdownTarget>
            <Combobox.Dropdown>
                <ScrollArea style={{ maxHeight: 350, overflowY: 'auto', position: "relative", zIndex: 100, }}>
                    <Combobox.Options>{options}</Combobox.Options>
                </ScrollArea>
            </Combobox.Dropdown>
        </Combobox>
    );
}
