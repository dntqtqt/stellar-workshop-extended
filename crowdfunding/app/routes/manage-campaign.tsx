import { useState, useEffect } from "react";
import { Card } from "~/components/card";
import { Button } from "~/components/ui/button";
import { useWallet } from "~/hooks/use-wallet";
import { useSubmitTransaction } from "~/hooks/use-submit-transaction";
import * as Crowdfund from "../../packages/crowdfunding";
import { signTransaction } from "~/config/wallet.client";
import { Donut } from "lucide-react";

export function meta() {
  return [
    { title: "Manage Campaign - Stellar Crowdfunding" },
    { name: "description", content: "Manage your crowdfunding campaign" },
  ];
}

interface DonorInfo {
  address: string;
  amount: number;
}

export default function ManageCampaign() {
  const RPC_URL = "https://soroban-testnet.stellar.org:443";
  const { address, isConnected } = useWallet();

  const [campaignData, setCampaignData] = useState<{
    total: number;
    goal: number;
    deadline: number;
    status: number;
    isOwner: boolean;
  }>({
    total: 0,
    goal: 0,
    deadline: 0,
    status: 0,
    isOwner: false,
  });

  const [donors, setDonors] = useState<DonorInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const { submit, isSubmitting } = useSubmitTransaction({
    rpcUrl: RPC_URL,
    networkPassphrase: Crowdfund.networks.testnet.networkPassphrase,
    onSuccess: () => {
      alert("Operation completed successfully!");
      fetchCampaignData();
    },
    onError: (error: any) => {
      console.error("Operation failed", error);
      alert("Operation failed. Please try again.");
    },
  });

  const fetchCampaignData = async () => {
    if (!isConnected || address === "-") return;

    try {
      const contract = new Crowdfund.Client({
        ...Crowdfund.networks.testnet,
        rpcUrl: RPC_URL,
        signTransaction,
        publicKey: address,
      });

      // Fetch total raised
      const totalTx = await contract.get_total_raised();
      const total = Number(BigInt(totalTx.result as any));

      // TODO: When new contract is deployed, fetch additional data:
      // const campaignInfoTx = await contract.get_campaign_info();
      // const donorsTx = await contract.get_all_donors();

      setCampaignData({
        total,
        goal: 1000_000_000, // Default 100 XLM - replace with actual data
        deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // Default 30 days
        status: 0, // Active
        isOwner: true, // For demo - in real app, check against campaign owner
      });

      // Mock donors data - replace with actual data from contract
      setDonors([
        { address: "GABC...DEFG", amount: 50_000_000 }, // 5 XLM
        { address: "GHIJ...KLMN", amount: 30_000_000 }, // 3 XLM
        { address: "GOPQ...RSTU", amount: 20_000_000 }, // 2 XLM
      ]);
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected || !campaignData.isOwner) return;

    try {
      // TODO: Implement when new contract is deployed
      alert("Withdrawal feature will be available after contract update");

      // const contract = new Crowdfund.Client({
      //   ...Crowdfund.networks.testnet,
      //   rpcUrl: RPC_URL,
      //   signTransaction,
      //   publicKey: address,
      // });
      //
      // const tx = await contract.withdraw({ owner: address });
      // await submit(tx);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-3xl font-bold">Manage Campaign</h1>
        <Card className="p-8">
          <p className="text-center">Please connect your wallet to manage your campaign.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-3xl font-bold">Campaign Management</h1>
        <Card className="p-8">
          <p className="text-center">Loading campaign data...</p>
        </Card>
      </div>
    );
  }

  const progress = campaignData.goal > 0 ? (campaignData.total / campaignData.goal) * 100 : 0;
  const isGoalReached = campaignData.total >= campaignData.goal;
  const isDeadlinePassed = Date.now() > campaignData.deadline;
  const canWithdraw = campaignData.isOwner && (isGoalReached || isDeadlinePassed);

  return (
    <div className="flex flex-col items-center gap-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Campaign Management</h1>

      {/* Campaign Overview */}
      <Card className="w-full p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Donut className="size-5" />
              Campaign Overview
            </h2>
            <span
              className={`px-3 py-1 rounded text-sm ${
                isGoalReached
                  ? "bg-green-100 text-green-800"
                  : isDeadlinePassed
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {isGoalReached ? "Goal Reached" : isDeadlinePassed ? "Expired" : "Active"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-300 ${
                isGoalReached ? "bg-green-600" : "bg-blue-600"
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{(campaignData.total / 10_000_000).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Raised (XLM)</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{(campaignData.goal / 10_000_000).toFixed(0)}</p>
              <p className="text-sm text-gray-600">Goal (XLM)</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{donors.length}</p>
              <p className="text-sm text-gray-600">Donors</p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Deadline: {new Date(campaignData.deadline).toLocaleDateString()}
            {isDeadlinePassed && " (Expired)"}
          </div>
        </div>
      </Card>

      {/* Actions */}
      {campaignData.isOwner && (
        <Card className="w-full p-6">
          <h3 className="text-lg font-semibold mb-4">Owner Actions</h3>
          <div className="flex gap-4">
            <Button
              onClick={handleWithdraw}
              disabled={!canWithdraw || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Processing..." : "Withdraw Funds"}
            </Button>
          </div>

          {!canWithdraw && (
            <p className="text-sm text-gray-600 mt-2">
              {!isGoalReached && !isDeadlinePassed
                ? "Withdrawal available when goal is reached or deadline passes"
                : "You can withdraw the raised funds"}
            </p>
          )}
        </Card>
      )}

      {/* Donors List */}
      <Card className="w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Donors</h3>
        {donors.length > 0 ? (
          <div className="space-y-3">
            {donors.map((donor, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-mono text-sm">{donor.address}</span>
                <span className="font-semibold">{(donor.amount / 10_000_000).toFixed(2)} XLM</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No donations yet</p>
        )}
      </Card>

      {/* Campaign Stats */}
      <Card className="w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {donors.length > 0
                ? (campaignData.total / donors.length / 10_000_000).toFixed(2)
                : "0"}
            </p>
            <p className="text-sm text-blue-800">Avg Donation (XLM)</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {Math.max(0, Math.ceil((campaignData.deadline - Date.now()) / (1000 * 60 * 60 * 24)))}
            </p>
            <p className="text-sm text-green-800">Days Remaining</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {((campaignData.total / campaignData.goal) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-purple-800">Success Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
