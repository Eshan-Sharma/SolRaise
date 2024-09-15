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

const Spinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
);



export default function HomePage() {
    const [mode, setMode] = useState("donor")

    const [isMounted, setIsMounted] = useState(false)

    const [currentProjectIndex, setCurrentProjectIndex] = useState(0)

    const projects = [
        { id: 1, title: "Community Garden", goal: 5000, raised: 2500, image: "/placeholder.svg?height=200&width=400" },
        { id: 2, title: "Local School Renovation", goal: 10000, raised: 7500, image: "/placeholder.svg?height=200&width=400" },
        { id: 3, title: "Homeless Shelter Support", goal: 8000, raised: 3000, image: "/placeholder.svg?height=200&width=400" },
        { id: 4, title: "Clean Energy Initiative", goal: 15000, raised: 9000, image: "/placeholder.svg?height=200&width=400" },
        { id: 5, title: "Youth Sports Program", goal: 6000, raised: 4500, image: "/placeholder.svg?height=200&width=400" },
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
                    <h2 className="text-5xl font-bold mb-4">Empower Change with Solana</h2>
                    <p className="text-xl mb-8">Fund innovative projects or create your own campaign on our decentralized platform.</p>
                    <Button className="bg-white text-black hover:bg-gray-200 text-lg py-6 px-8">Get Started</Button>
                </section>

                {/* Featured Projects Carousel */}
                <section className="mb-20">
                    <h3 className="text-2xl font-bold mb-4">Featured Projects</h3>
                    <div className="relative">
                        <Card className="bg-gray-900 overflow-hidden">
                            <img src={projects[currentProjectIndex].image} alt={projects[currentProjectIndex].title} className="w-full h-64 object-cover" />
                            <CardContent className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4">
                                <CardTitle>{projects[currentProjectIndex].title}</CardTitle>
                                <CardDescription>
                                    Goal: {projects[currentProjectIndex].goal} SOL | Raised: {projects[currentProjectIndex].raised} SOL
                                </CardDescription>
                                <div className="mt-2 h-2 bg-gray-700 rounded-full">
                                    <div
                                        className="h-full bg-white rounded-full transition-all duration-500 ease-in-out"
                                        style={{ width: `${(projects[currentProjectIndex].raised / projects[currentProjectIndex].goal) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Button
                            variant="outline"
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75"
                            onClick={() => setCurrentProjectIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="outline"
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75"
                            onClick={() => setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length)}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                </section>

                {/* Mode Toggle */}
                <div className="flex justify-end mb-4 items-center space-x-2">
                    <Label htmlFor="mode-toggle" className="text-sm font-medium">Recipient Mode</Label>
                    <Switch
                        id="mode-toggle"
                        checked={mode === "recipient"}
                        onCheckedChange={(checked) => setMode(checked ? "recipient" : "donor")}
                    />
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="projects" className="w-full mb-20">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="projects" className="text-lg">
                            {mode === "donor" ? "Explore Projects" : "My Projects"}
                        </TabsTrigger>
                        <TabsTrigger value="create" className="text-lg">
                            {mode === "donor" ? "Make a Donation" : "Create Project"}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="projects">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <Card key={project.id} className="bg-gray-900 hover:bg-gray-800 transition-colors">
                                    <CardHeader>
                                        <CardTitle>{project.title}</CardTitle>
                                        <CardDescription>
                                            Goal: {project.goal} SOL | Raised: {project.raised} SOL
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-2 bg-gray-700 rounded-full">
                                            <div
                                                className="h-full bg-white rounded-full transition-all duration-500 ease-in-out"
                                                style={{ width: `${(project.raised / project.goal) * 100}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        {mode === "donor" && (
                                            <Button className="w-full bg-white text-black hover:bg-gray-200">
                                                <CircleDollarSign className="mr-2 h-4 w-4" /> Donate
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="create">
                        <Card className="bg-gray-900">
                            <CardHeader>
                                <CardTitle>{mode === "donor" ? "Make a Donation" : "Create a Project"}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{mode === "donor" ? "Project Name" : "Project Title"}</Label>
                                        <Input id="name" placeholder="Enter name" className="bg-gray-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">{mode === "donor" ? "Donation Amount" : "Funding Goal"}</Label>
                                        <Input id="amount" placeholder="Enter amount in SOL" type="number" step="0.1" className="bg-gray-800" />
                                    </div>
                                    {mode === "recipient" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Project Description</Label>
                                            <Input id="description" placeholder="Enter project description" className="bg-gray-800" />
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-white text-black hover:bg-gray-200">
                                    {mode === "donor" ? (
                                        <>
                                            <CircleDollarSign className="mr-2 h-4 w-4" /> Donate
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Create Project
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Statistics Section */}
                <section id="stats" className="py-20 border-t border-gray-800">
                    <h3 className="text-3xl font-bold mb-8 text-center">Platform Statistics</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-gray-900">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="mr-2 h-6 w-6" /> Total Raised
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold">50,000 SOL</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="mr-2 h-6 w-6" /> Active Projects
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold">250+</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-900">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <DollarSign className="mr-2 h-6 w-6" /> Avg. Donation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold">20 SOL</p>
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
                </div>
            </footer>
        </div>
    )
}