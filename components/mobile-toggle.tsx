import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import NavigationSidebar from './navigation/NavigationSidebar'
import ServerSidebar from './server/ServerSidebar'

export default function MobileToggle({serverId}: {serverId: string}) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex flex-row gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar serverId={serverId}/>
            </SheetContent>
        </Sheet>
    )
}
