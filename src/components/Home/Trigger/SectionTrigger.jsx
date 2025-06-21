import React from 'react'
import { NavLink } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Icons } from '@/components';

const SectionTrigger = () => {

    const sections = [
        {
            NavName: "Home",
            slug: "/",
        },
        {
            NavName: "Responders Section",
            slug: "/Responders-Section",
        },
        {
            NavName: "Find People",
            slug: "/Find-People",
        },
        {
            NavName: "Have a Query ?",
            slug: `/AskQuestion`,
        },
        {
            NavName: "Browse Question",
            slug: `/BrowseQuestion/${null}/${null}`,
        },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant='outline'
                    className="md:hidden w-10 text-slate-600">
                    <Icons.dropdownleft className="text-lg" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
                <DropdownMenuLabel>Sections</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sections?.map((section) => (
                    <DropdownMenuItem>
                        <NavLink
                            className={({ isActive }) => `${isActive ? "font-bold underline" : ""}`}
                            to={section.slug}
                            key={section.NavName}
                        >{section.NavName}</NavLink>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SectionTrigger