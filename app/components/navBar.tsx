"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/api/useAuth";

type LinkItem = {
    label: string;
    href: string;
};

type DropdownItem = {
    label: string;
    children: LinkItem[];
    defaultOpen?: boolean;
};

type NavItem = LinkItem | DropdownItem;

function isDropdownItem(item: NavItem): item is DropdownItem {
    return "children" in item;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/mainApp?view=dashboard" },
    {
        label: "Investments",
        defaultOpen: false,
        children: [
            { label: "Positions", href: "/mainApp/positions" },
            { label: "Transactions", href: "/mainApp/transactions" },
        ],
    },
    { label: "Analytics", defaultOpen: false,
        children: [
            { label: "Performance", href: "/mainApp/analytics/performance" },
            { label: "Benchmarks", href: "/mainApp/analytics/benchmarks" },
            { label: "Historic Returns", href: "/mainApp/returns" },
        ]
    }
];

export default function NavBar() {
    const router = useRouter();
    const { logout } = useAuth();

    function handleLogout() {
        logout();
        router.push("/auth/login");
    }

    return (
        <div className="flex-1  h-full max-w-[18rem] rounded-4xl bg-black justify-between flex-col hidden sm:flex backdrop-blur-sm ">
            <nav className="m-10 flex flex-col">
                <h1 className="text-3xl font-black">Overview</h1>
                <ul className="mt-4 flex flex-col gap-2">
                    {navItems.map((item) => {
                        if (isDropdownItem(item)) {
                            return (
                                <li key={item.label}>
                                      <details className="group" open={item.defaultOpen}>
                                        <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-gray-200 hover:text-gray-100">
                                            {item.label}
                                            <span className="text-sm text-gray-400 transition-transform group-open:rotate-180">
                                                ▾
                                            </span>
                                        </summary>
                                        <ul className="mt-2 ml-3 flex flex-col gap-2 border-l border-neutral-800 pl-3">
                                            {item.children.map((child) => (
                                                <li key={child.label}>
                                                    <Link
                                                        href={child.href}
                                                        className="text-base font-medium text-gray-300 hover:text-gray-100"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            );
                        }

                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className="text-lg font-medium text-gray-200 hover:text-gray-100"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <nav>
                <ul className="m-10 mt-auto flex flex-col gap-2">
                    <li>
                        <Link
                            href="/mainApp/portfolio"
                            className="text-lg font-medium text-gray-300 hover:text-gray-100"
                        >
                            Portfolio
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/mainApp/profile"
                            className="text-lg font-medium text-gray-300 hover:text-gray-100"
                        >
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/mainApp/settings"
                            className="text-lg font-medium text-gray-300 hover:text-gray-100"
                        >
                            Settings
                        </Link>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-lg font-medium text-gray-300 hover:text-gray-100"
                        >
                            Logout
                        </button>
                    </li>
                </ul>


            </nav>
        </div>
    );
}