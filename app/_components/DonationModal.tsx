import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { sendDonation } from "../actions/storing-data-in-db";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  goal: number;
  raised: number;
  daysLeft?: number;
  image: string;
}

interface DonationModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [matchDonation, setMatchDonation] = useState<boolean>(false);
  const [maxMatchAmount, setMaxMatchAmount] = useState<string>("");
  const { publicKey } = useWallet();
  const { toast } = useToast()

  const handleDonate = async () => {

    if (!publicKey) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to create a campaign.",
        duration: 3000,
      });
      return;
    }
    await sendDonation(project.id.toString(), publicKey?.toString(), parseFloat(donationAmount) ?? parseFloat(maxMatchAmount));
    console.log("Donation amount:", donationAmount);
    console.log("Match donation:", matchDonation);
    console.log("Max match amount:", maxMatchAmount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 rounded-lg shadow-lg p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl font-extrabold text-purple-700">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Support this project and make a difference!
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <Progress
            value={(project.raised / project.goal) * 100}
            className="w-full h-3 bg-gray-300 rounded-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Goal: {project.goal} SOL</span>
            <span>Raised: {project.raised} SOL</span>
            <span>Days left: {project?.daysLeft}</span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="donationAmount"
              className="text-lg font-semibold text-gray-700"
            >
              Donation Amount (SOL)
            </Label>
            <Input
              id="donationAmount"
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="bg-gray-100 text-gray-900 border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter donation amount"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Switch
              id="matchDonation"
              checked={matchDonation}
              onCheckedChange={setMatchDonation}
              className="rounded-full"
            />
            <Label
              htmlFor="matchDonation"
              className="text-lg font-semibold text-gray-700"
            >
              Match Donation
            </Label>
          </div>
          {matchDonation && (
            <div className="space-y-3">
              <Label
                htmlFor="maxMatchAmount"
                className="text-lg font-semibold text-gray-700"
              >
                Maximum Match Amount (SOL)
              </Label>
              <Input
                id="maxMatchAmount"
                type="number"
                value={maxMatchAmount}
                onChange={(e) => setMaxMatchAmount(e.target.value)}
                className="bg-gray-100 text-gray-900 border-gray-300 rounded-lg px-4 py-2"
                placeholder="Enter max match amount"
              />
            </div>
          )}
          {matchDonation && (
            <div className="text-sm text-gray-600 bg-purple-100 p-4 rounded-lg">
              <p className="font-medium mb-2">Matching Donation Details:</p>
              <p>• Match all individual donations up to your maximum amount</p>
              <p>• Condition → Project Progress: 80%</p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-8">
          <Button
            onClick={handleDonate}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold rounded-lg transition-all"
          >
            Make Donation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
