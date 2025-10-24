import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "~/components/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { useWallet } from "~/hooks/use-wallet";
import { useSubmitTransaction } from "~/hooks/use-submit-transaction";
import * as Crowdfund from "../../packages/crowdfunding";
import { signTransaction } from "~/config/wallet.client";
import { Donut } from "lucide-react";

export function meta() {
  return [
    { title: "Create Campaign - Stellar Crowdfunding" },
    { name: "description", content: "Create a new crowdfunding campaign" },
  ];
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { address, isConnected } = useWallet();
  const RPC_URL = "https://soroban-testnet.stellar.org:443";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    goal: "",
    deadline: "",
    minDonation: "",
  });

  const { submit, isSubmitting } = useSubmitTransaction({
    rpcUrl: RPC_URL,
    networkPassphrase: Crowdfund.networks.testnet.networkPassphrase,
    onSuccess: () => {
      alert("Campaign created successfully!");
      navigate("/");
    },
    onError: (error) => {
      console.error("Campaign creation failed", error);
      alert("Failed to create campaign. Please try again.");
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      // Validate inputs
      const goalXLM = parseFloat(formData.goal);
      const minDonationXLM = parseFloat(formData.minDonation || "0");
      const deadlineDate = new Date(formData.deadline);

      if (goalXLM <= 0) {
        alert("Goal must be positive");
        return;
      }

      if (deadlineDate <= new Date()) {
        alert("Deadline must be in the future");
        return;
      }

      if (minDonationXLM < 0) {
        alert("Minimum donation cannot be negative");
        return;
      }

      // Convert to stroops
      const goalStroops = BigInt(Math.floor(goalXLM * 10_000_000));
      const minDonationStroops = BigInt(Math.floor(minDonationXLM * 10_000_000));
      const deadlineTimestamp = BigInt(Math.floor(deadlineDate.getTime() / 1000));

      const contract = new Crowdfund.Client({
        ...Crowdfund.networks.testnet,
        rpcUrl: RPC_URL,
        signTransaction,
        publicKey: address,
      });

      // XLM token address for testnet
      const xlmTokenAddress = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

      // Note: Using old interface for now - update after deploying new contract
      const tx = await contract.initialize({
        owner: address,
        goal: goalStroops,
        deadline: deadlineTimestamp,
        xlm_token: xlmTokenAddress,
        // TODO: Add these after contract update:
        title: formData.title,
        description: formData.description,
        image_url: formData.imageUrl,
        min_donation: minDonationStroops,
      });

      await submit(tx);
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create transaction. Please try again.");
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-3xl font-bold">Create Campaign</h1>
        <Card className="p-8">
          <p className="text-center">Please connect your wallet to create a campaign.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Create New Campaign</h1>

      <Card className="w-full p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              placeholder="Enter campaign title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("title", e.target.value)
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your campaign, what you're raising funds for..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("description", e.target.value)
              }
              required
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("imageUrl", e.target.value)
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Goal (XLM) *</Label>
              <Input
                id="goal"
                type="number"
                step="0.0000001"
                min="0.0000001"
                placeholder="100"
                value={formData.goal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("goal", e.target.value)
                }
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minDonation">Min Donation (XLM)</Label>
              <Input
                id="minDonation"
                type="number"
                step="0.0000001"
                min="0"
                placeholder="0.1"
                value={formData.minDonation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("minDonation", e.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("deadline", e.target.value)
              }
              required
              min={new Date().toISOString().slice(0, 16)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
