import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { getSignedURL } from '@/lib/utils';
import { sendCampaignToDb } from '../actions/storing-data-in-db';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CampaignModal = ({ isOpen, onClose }: CampaignModalProps) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [fundsGoal, setFundingGoal] = useState<number | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>('');
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { publicKey } = useWallet();

    const { toast } = useToast()

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setFundingGoal(null);
        setDuration(null);
        setImageUrl(undefined);
        setImageFile(undefined);
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setImageFile(selectedFile);
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setImageUrl(url);
        } else {
            setImageUrl(undefined);
        }
    };

    const handleCreateCampaign = async () => {
        if (!publicKey) {
            toast({
                variant: "destructive",
                title: "Wallet not connected",
                description: "Please connect your wallet to create a campaign.",
                duration: 3000,
            });
            return;
        }

        if (!title || !description || !fundsGoal || !duration || !imageFile) {
            toast({
                variant: "destructive",
                title: "Incomplete form",
                description: "Please fill out all fields and upload an image.",
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);

        try {
            const signedUrlResult = await getSignedURL(imageFile.name);
            if ('error' in signedUrlResult) {
                throw new Error("Unable to get signed URL for image upload");
            }

            const url = signedUrlResult.success.url;
            await fetch(url, {
                method: "PUT",
                body: imageFile,
                headers: {
                    "Content-Type": imageFile.type || "",
                },
            });

            const imageUrl = url.split('?')[0];

            await sendCampaignToDb(title, description, fundsGoal, duration, publicKey.toString(), imageUrl);

            toast({
                variant: "default",
                title: "Campaign created successfully",
                description: "Your campaign has been uploaded and is now live!",
                duration: 3000,
                className: "bg-white text-black border border-gray-200",
            });

            resetForm();
            onClose();
        } catch (error) {
            console.error("Error creating campaign:", error);
            toast({
                variant: "destructive",
                title: "Campaign creation failed",
                description: "There was an error creating your campaign. Please try again.",
                duration: 3000,
                className: "bg-white text-black border border-gray-200",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetForm();
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 rounded-lg shadow-lg p-6">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-3xl font-extrabold text-purple-700">Start A Campaign</DialogTitle>
                    <DialogDescription className="text-lg text-gray-600">Support this project and make a difference!</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-lg font-semibold text-gray-700">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-gray-100 text-gray-900 border-gray-300 rounded-lg px-4 py-2"
                            placeholder="Enter campaign title"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="description" className="text-lg font-semibold text-gray-700">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-gray-100 text-gray-900 border-gray-300 rounded-lg px-4 py-2"
                            placeholder="Enter campaign description"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="fundsGoal" className="text-lg font-semibold text-gray-700">Funding Goal (SOL)</Label>
                        <Input
                            id="fundsGoal"
                            type="number"
                            value={fundsGoal || ''}
                            onChange={(e) => setFundingGoal(parseFloat(e.target.value))}
                            className="bg-gray-100 text-gray-900 border-gray-300 rounded-lg px-4 py-2"
                            placeholder="Enter funding goal"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="duration" className="text-lg font-semibold text-gray-700">Duration (days)</Label>
                        <Input
                            id="duration"
                            type="number"
                            value={duration || ''}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="bg-gray-100 text-gray-900 border-gray-300 rounded-lg px-4 py-2"
                            placeholder="Enter campaign duration"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="image" className="text-lg font-semibold text-gray-700">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            onChange={onFileChange}
                            className="bg-gray-100 text-gray-900 border-gray-300 rounded-lg px-4 py-2"
                            accept="image/*"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <DialogFooter className="mt-8">
                    <Button
                        onClick={handleCreateCampaign}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold rounded-lg transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Campaign...
                            </>
                        ) : (
                            'Create Campaign'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CampaignModal;