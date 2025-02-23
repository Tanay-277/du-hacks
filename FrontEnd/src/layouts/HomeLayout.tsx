import { Appbar } from "@/components/blocks";
import { Outlet } from "react-router";

export default function HomeLayout() {
    return (
        <div>
            <Appbar />
            <Outlet />
        </div>
    );
}