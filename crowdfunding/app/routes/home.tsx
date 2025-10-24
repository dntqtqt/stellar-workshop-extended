import { Card } from "~/components/card";
import { TextRotate } from "~/components/text-rotate";
import { Button } from "~/components/ui/button";
import { CampaignDetails } from "~/components/campaign-details";
import { useWallet } from "~/hooks/use-wallet";
import { Link } from "react-router";
import { Donut } from "lucide-react";

export function meta() {
  return [
    { title: "Stellar Crowdfunding Platform" },
    { name: "description", content: "Decentralized crowdfunding on Stellar blockchain" },
  ];
}

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="flex flex-col items-center gap-y-16">
      {/* Header */}
      <div className="flex flex-row items-center gap-x-6">
        <p className="text-4xl">Learning</p>
        <TextRotate
          texts={["Stellar", "Rust", "Contract", "Frontend"]}
          mainClassName="bg-white text-black rounded-lg text-4xl px-6 py-3"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </div>

      {/* Navigation */}
      <Card className="p-6 w-full max-w-2xl">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center">Stellar Crowdfunding Platform</h2>
          <p className="text-gray-600 text-center">
            Create and support crowdfunding campaigns on the Stellar blockchain
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/create-campaign">
              <Button className="flex items-center gap-2">
                <Donut className="size-4" />
                Create Campaign
              </Button>
            </Link>

            {isConnected && (
              <Link to="/manage-campaign">
                <Button variant="outline" className="flex items-center gap-2">
                  <Donut className="size-4" />
                  Manage Campaign
                </Button>
              </Link>
            )}

            {!isConnected && (
              <div className="text-sm text-gray-500 flex items-center">
                Connect your wallet to get started
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Current Campaign */}
      <div className="w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4 text-center">Current Campaign</h3>
        <CampaignDetails />
      </div>
    </div>
  );
}
