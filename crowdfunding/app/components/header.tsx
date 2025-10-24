import { NavLink } from "react-router";
import { ConnectWallet } from "./connect-wallet";
import { useWallet } from "~/hooks/use-wallet";

export function Header() {
  const { isConnected } = useWallet();

  return (
    <div className="flex flex-row items-center justify-between mb-20 mt-8 px-[50px]">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight flex items-center">
          <NavLink to="/" className="hover:underline">
            Crowdfund
          </NavLink>
          .
        </h2>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/create-campaign"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            Create Campaign
          </NavLink>

          {isConnected && (
            <NavLink
              to="/manage-campaign"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              Manage
            </NavLink>
          )}
        </nav>
      </div>

      <ConnectWallet />
    </div>
  );
}
