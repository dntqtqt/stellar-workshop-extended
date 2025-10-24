import { Card } from "~/components/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useWallet } from "~/hooks/use-wallet";
import { useNativeBalance } from "~/hooks/use-native-balance";
import { useSubmitTransaction } from "~/hooks/use-submit-transaction";
import * as Crowdfund from "../../packages/crowdfunding";
import { signTransaction } from "~/config/wallet.client";
import { useState, useMemo, useEffect } from "react";
import { Donut } from "lucide-react";

interface CampaignDetailsProps {
  contractAddress?: string;
}

export function CampaignDetails({ contractAddress }: CampaignDetailsProps) {
  const RPC_URL = "https://soroban-testnet.stellar.org:443";
  const { address, isConnected } = useWallet();
  const { balance, refetch: refetchBalance } = useNativeBalance(address);

  const [amount, setAmount] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [campaignInfo, setCampaignInfo] = useState<{
    goal: number;
    deadline: number;
    status: number;
    minDonation: number;
  } | null>(null);
  const [userDonation, setUserDonation] = useState(0);
  const [progress, setProgress] = useState(0);

  const contract = useMemo(() => {
    if (!isConnected || address === "-") return null;

    return new Crowdfund.Client({
      ...Crowdfund.networks.testnet,
      rpcUrl: RPC_URL,
      signTransaction,
      publicKey: address,
    });
  }, [isConnected, address]);

  const { submit, isSubmitting } = useSubmitTransaction({
    rpcUrl: RPC_URL,
    networkPassphrase: Crowdfund.networks.testnet.networkPassphrase,
    onSuccess: handleOnSuccess,
    onError: (error) => {
      console.error("Donation failed", error);
    },
  });

  async function handleOnSuccess() {
    await fetchCampaignData();
    await refetchBalance();
    setAmount("");
  }

  async function fetchCampaignData() {
    if (!contract) return;

    try {
      // Fetch total raised
      const totalTx = await contract.get_total_raised();
      const totalRaised = Number(BigInt(totalTx.result as any));

      setPreviousTotal(total);
      setTotal(totalRaised);

      // Fetch user's donation if connected
      if (isConnected && address !== "-") {
        try {
          const donationTx = await contract.get_donation({ donor: address });
          const userDonationAmount = Number(BigInt(donationTx.result as any));
          setUserDonation(userDonationAmount);
        } catch (err) {
          setUserDonation(0);
        }
      }

      // TODO: Fetch campaign info when new contract is deployed
      // const campaignInfoTx = await contract.get_campaign_info();
      // setCampaignInfo(campaignInfoTx.result);

      // For now, set some default values
      setCampaignInfo({
        goal: 1000_000_000, // 100 XLM default goal
        deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        status: 0, // Active
        minDonation: 1_000_000, // 0.1 XLM default
      });

      // Calculate progress
      const goalAmount = campaignInfo?.goal || 1000_000_000;
      const progressPercent = (totalRaised / goalAmount) * 100;
      setProgress(Math.min(progressPercent, 100));
    } catch (err) {
      console.error("Error fetching campaign data:", err);
      setTotal(0);
      setUserDonation(0);
    }
  }

  async function handleSubmit() {
    if (!isConnected || !contract) return;
    if (!amount.trim()) return;

    try {
      // Convert XLM to stroops (multiply by 10^7)
      const xlmAmount = parseFloat(amount.trim());
      const stroopsAmount = Math.floor(xlmAmount * 10_000_000);

      // Check minimum donation
      if (campaignInfo && stroopsAmount < campaignInfo.minDonation) {
        alert(`Minimum donation is ${(campaignInfo.minDonation / 10_000_000).toFixed(7)} XLM`);
        return;
      }

      const tx = (await contract.donate({
        donor: address,
        amount: BigInt(stroopsAmount),
      })) as any;

      await submit(tx);
    } catch (e) {
      console.error("Failed to create donation transaction", e);
    }
  }

  async function handleWithdraw() {
    if (!isConnected || !contract) return;

    try {
      // TODO: Implement withdrawal when new contract is deployed
      // const tx = await contract.withdraw({ owner: address });
      // await submit(tx);
      alert("Withdrawal feature will be available after contract update");
    } catch (e) {
      console.error("Failed to withdraw", e);
    }
  }

  async function handleRefund() {
    if (!isConnected || !contract) return;

    try {
      // TODO: Implement refund when new contract is deployed
      // const tx = await contract.refund({ donor: address });
      // await submit(tx);
      alert("Refund feature will be available after contract update");
    } catch (e) {
      console.error("Failed to request refund", e);
    }
  }

  useEffect(() => {
    fetchCampaignData();
  }, [contract]);

  const isDeadlinePassed = campaignInfo ? Date.now() > campaignInfo.deadline : false;
  const isGoalReached = campaignInfo ? total >= campaignInfo.goal : false;
  const statusText =
    campaignInfo?.status === 1
      ? "Successful"
      : campaignInfo?.status === 2
        ? "Failed"
        : campaignInfo?.status === 3
          ? "Withdrawn"
          : "Active";

  return (
    <div className="flex flex-col gap-y-6">
      {/* Campaign Progress */}
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campaign Progress</h2>
            <span
              className={`px-2 py-1 rounded text-sm ${
                statusText === "Active"
                  ? "bg-green-100 text-green-800"
                  : statusText === "Successful"
                    ? "bg-blue-100 text-blue-800"
                    : statusText === "Failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {statusText}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{(total / 10_000_000).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Raised (XLM)</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {campaignInfo ? (campaignInfo.goal / 10_000_000).toFixed(0) : "0"}
              </p>
              <p className="text-sm text-gray-600">Goal (XLM)</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>

          {campaignInfo && (
            <div className="text-center text-sm text-gray-600">
              Deadline: {new Date(campaignInfo.deadline).toLocaleDateString()}
              {isDeadlinePassed && " (Expired)"}
            </div>
          )}
        </div>
      </Card>

      {/* Donation Form */}
      <Card className="flex flex-col gap-y-6 py-4 px-8">
        <p className="flex flex-row items-center gap-x-2 text-lg mb-6 font-medium">
          <Donut className="size-5" />
          Donate {balance}
        </p>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <img src="https://placehold.co/10" className="size-10 rounded-full" />
            <p>XLM</p>
          </div>
          <p className="tabular-nums flex gap-1">
            {!isConnected && <span>Connect wallet</span>}
            {isConnected && balance === "-" && <span>-</span>}
            {isConnected && balance !== "-" && (
              <>
                <span>{balance}</span>
                <span>XLM</span>
              </>
            )}
          </p>
        </div>

        {userDonation > 0 && (
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Your contribution: <strong>{(userDonation / 10_000_000).toFixed(7)} XLM</strong>
            </p>
          </div>
        )}

        <Input
          type="text"
          inputMode="decimal"
          placeholder={`Min: ${campaignInfo ? (campaignInfo.minDonation / 10_000_000).toFixed(7) : "0.001"} XLM`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
          value={amount}
          disabled={isSubmitting || isDeadlinePassed || statusText !== "Active"}
        />

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={
              !isConnected ||
              isSubmitting ||
              !amount.trim() ||
              isDeadlinePassed ||
              statusText !== "Active"
            }
          >
            {isSubmitting ? "Donating..." : "Donate"}
          </Button>

          {/* Owner Actions */}
          {isConnected && (
            <>
              <Button
                variant="outline"
                onClick={handleWithdraw}
                disabled={isSubmitting || !isGoalReached}
                className="px-3"
              >
                Withdraw
              </Button>

              {userDonation > 0 && (
                <Button
                  variant="outline"
                  onClick={handleRefund}
                  disabled={isSubmitting || !isDeadlinePassed || isGoalReached}
                  className="px-3"
                >
                  Refund
                </Button>
              )}
            </>
          )}
        </div>

        {previousTotal > 0 && previousTotal !== total && (
          <div className="text-center">
            <p className="text-sm text-green-600">
              +{((total - previousTotal) / 10_000_000).toFixed(7)} XLM added
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
