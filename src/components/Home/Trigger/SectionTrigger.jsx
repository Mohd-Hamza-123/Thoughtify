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
import { Icons } from '@/components';

const SectionTrigger = ({ className }) => {

    const sections = [
        {
            NavName: "Home",
            slug: "/",
        },
        {
            NavName: "Responders",
            slug: "/responders-post",
        },
        {
            NavName: "Find People",
            slug: "/find-people",
        },
        {
            NavName: "Have a Query ?",
            slug: `/ask-question`,
        },
        {
            NavName: "Browse Question",
            slug: `/browse-question/${null}/${null}`,
        },
    ];

    return (
        <DropdownMenu className={`${className}`}>
            <DropdownMenuTrigger className='md:hidden w-10 text-slate-600 border rounded-sm flex justify-center items-center p-2'>
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