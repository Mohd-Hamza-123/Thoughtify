import React from 'react'
import { Icons } from '@/components';
import { Button } from "@/components/ui/button";
import SectionTrigger from './SectionTrigger';


const Trigger = ({ setSwitchTrigger }) => {

    return (

        <div className='flex justify-between mx-4'>
            <Button
                onClick={() => setSwitchTrigger((prev) => !prev)}
                className="flex justify-center items-center w-10 md:hidden"
                variant="outline">
                <Icons.switch className="text-xl text-slate-600" />
            </Button>

            <SectionTrigger />

        </div>
    )
}

export default Trigger