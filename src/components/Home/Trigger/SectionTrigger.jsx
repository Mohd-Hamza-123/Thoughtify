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

const SectionTrigger = ({ className }) => {

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
        <DropdownMenu className={`${className}`}>
            <DropdownMenuTrigger className='md:hidden w-10 text-slate-600 border rounded-sm flex justify-center items-center'>
                <Icons.dropdownleft className="text-lg" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
                <DropdownMenuLabel>Section</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sections?.map((section) => (
                    <DropdownMenuItem key={section.NavName}>
                        <NavLink
                            className={({ isActive }) => `${isActive ? "font-bold underline" : ""}`}
                            to={section.slug}
                        >{section.NavName}</NavLink>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SectionTrigger