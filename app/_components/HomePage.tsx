"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { CircleDollarSign, PlusCircle, ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign } from "lucide-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import DonationModal from "./DonationModal"
import Image from "next/image"
import CampaignModal from "./CampaignModal"
import ProjectCarousel from "./ProjectCarousel"

const Spinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
);

interface Project {
    id: number;
    title: string;
    goal: number;
    raised: number;
    daysLeft?: number;
    image: string;
}


export default function HomePage() {
    const [mode, setMode] = useState<"donor" | "recipient">("donor")
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0)
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    const projects = [
        { id: 1, title: "Community Garden", goal: 500, raised: 250, image: "/community-garden.png", daysLeft: 10 },
        { id: 2, title: "Local School Renovation", goal: 1000, raised: 750, image: "/school-renovation.png", daysLeft: 30 },
        { id: 3, title: "Homeless Shelter Support", goal: 800, raised: 300, image: "/homeless-support.png", daysLeft: 5 },
        { id: 4, title: "Clean Energy Initiative", goal: 1500, raised: 900, image: "/clean-energy.png", daysLeft: 100 },
        { id: 5, title: "Youth Sports Program", goal: 600, raised: 450, image: "/youth-sports.png", daysLeft: 4 },
    ]

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [projects.length])

    const openDonationModal = (project: Project) => {
        setSelectedProject(project)
        setIsModalOpen(true)
    }

    if (!isMounted) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="border-b border-gray-800 p-4 sticky top-0 bg-black z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">SolRaise</h1>
                    <nav className="space-x-4">
                        <a href="#projects" className="hover:text-gray-300 transition-colors">Projects</a>
                        <a href="#about" className="hover:text-gray-300 transition-colors">About us</a>
                        <a href="#stats" className="hover:text-gray-300 transition-colors">Stats</a>
                        <a href="#newsletter" className="hover:text-gray-300 transition-colors">Newsletter</a>
                    </nav>
                    <WalletMultiButton className="bg-white text-black hover:bg-gray-200 text-lg py-6 px-8" />
                </div>
            </header>

            <main className="container mx-auto p-4">
                {/* Hero Section */}
                <section className="py-20 text-center">
                    <h2 className="text-6xl font-bold mb-4 ">Empower Change with Solana</h2>
                    <p className="text-xl mb-8">Fund innovative projects or create your own campaign on our decentralized platform.</p>
                    <Button onClick={() => { setIsCampaignModalOpen(true) }} className="bg-white text-black hover:bg-gray-200 text-lg py-6 px-8">Get Started</Button>
                </section>

                {/* Featured Projects Carousel */}
                <section className="mb-20">
                    <h3 className="text-2xl font-bold mb-4">Featured Projects</h3>
                    <ProjectCarousel projects={projects} />
                </section>


                <section className="mb-20">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold mb-4">Explore Projects</h3>

                        {/* Mode Toggle */}
                        {/* <div className="flex justify-end mb-4 items-center space-x-2">
                            <Label htmlFor="mode-toggle" className="text-sm font-medium text-white">Recipient Mode</Label>
                            <Switch
                                id="mode-toggle"
                                checked={mode === "recipient"}
                                onCheckedChange={(checked) => setMode(checked ? "recipient" : "donor")}
                            />
                        </div> */}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <Card key={project.id} className="bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-white text-xl">{project.title}</CardTitle>
                                    <CardDescription className="text-gray-300">
                                        Goal: {project.goal} SOL | Raised: {project.raised} SOL
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-2 bg-gray-700 rounded-full">
                                        <div
                                            className="h-full bg-purple-400 rounded-full transition-all duration-500 ease-in-out"
                                            style={{ width: `${(project.raised / project.goal) * 100}%` }}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    {mode === "donor" && (
                                        <Button
                                            className="w-full bg-white text-gray-800 hover:bg-gray-200"
                                            onClick={() => openDonationModal(project)}
                                        >
                                            <CircleDollarSign className="mr-2 h-4 w-4" /> Donate
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </section>

                {/* Statistics Section */}

                <section id="stats" className="py-20 border-t border-gray-700">
                    <h3 className="text-4xl font-bold mb-8 text-center text-purple-300">Platform Statistics</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-gray-800 border border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center text-purple-300 text-xl">
                                    <TrendingUp className="mr-2 h-6 w-6" /> Total Raised
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-white">50,000 SOL</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center text-purple-300 text-xl">
                                    <Users className="mr-2 h-6 w-6" /> Active Projects
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-white">250+</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center text-purple-300 text-xl">
                                    <DollarSign className="mr-2 h-6 w-6" /> Avg. Donation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-white">20 SOL</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Newsletter Signup */}
                <section id="newsletter" className="py-20 border-t border-gray-800">
                    <h3 className="text-3xl font-bold mb-4 text-center">Stay Updated</h3>
                    <p className="text-center mb-8">Subscribe to our newsletter for the latest projects and platform updates.</p>
                    <form className="flex max-w-md mx-auto">
                        <Input type="email" placeholder="Enter your email" className="bg-gray-800 flex-grow" />
                        <Button type="submit" className="ml-2 bg-white text-black hover:bg-gray-200">Subscribe</Button>
                    </form>
                </section>
            </main>

            <footer className="bg-gray-900 py-12 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="font-bold mb-4">About Us</h4>
                            <p className="text-sm text-gray-400">Empowering innovation through decentralized crowdfunding on Solana.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Start a Project</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Explore Projects</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Connect</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} Solana Crowdfunding. All rights reserved.
                    </div>
                    {selectedProject && (
                        <DonationModal
                            project={selectedProject}
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}
                    <CampaignModal
                        isOpen={isCampaignModalOpen}
                        onClose={() => setIsCampaignModalOpen(false)}
                    />
                </div>
            </footer>
        </div>
    )
}