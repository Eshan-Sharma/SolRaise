import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  goal: number;
  raised: number;
  image: string;
  daysLeft?: number;
}

interface CarouselProps {
  projects: Project[];
}

const ProjectCarousel: React.FC<CarouselProps> = ({ projects }) => {
  const projectsPerSlide = 3;
  const [currentIndex, setCurrentIndex] = useState(projectsPerSlide);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const extendedProjects = [
    ...projects.slice(-projectsPerSlide),
    ...projects,
    ...projects.slice(0, projectsPerSlide),
  ];

  const handleSlide = useCallback(
    (direction: "next" | "prev") => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        direction === "next"
          ? prevIndex + projectsPerSlide
          : prevIndex - projectsPerSlide
      );
    },
    [isTransitioning, projectsPerSlide]
  );

  const handleNextSlide = useCallback(() => handleSlide("next"), [handleSlide]);
  const handlePrevSlide = useCallback(() => handleSlide("prev"), [handleSlide]);

  useEffect(() => {
    const timer = setInterval(handleNextSlide, 5000);
    return () => clearInterval(timer);
  }, [handleNextSlide]);

  useEffect(() => {
    if (!isTransitioning) return;

    const transitionEndHandler = () => {
      setIsTransitioning(false);
      if (currentIndex >= extendedProjects.length - projectsPerSlide) {
        resetCarousel(projectsPerSlide);
      } else if (currentIndex <= 0) {
        resetCarousel(extendedProjects.length - projectsPerSlide * 2);
      }
    };

    const resetCarousel = (newIndex: number) => {
      setCurrentIndex(newIndex);
      if (carouselRef.current) {
        carouselRef.current.style.transition = "none";
        carouselRef.current.style.transform = `translateX(-${(newIndex * 100) / projectsPerSlide
          }%)`;
        // Force reflow
        carouselRef.current.offsetHeight;
        carouselRef.current.style.transition = "transform 0.5s ease-in-out";
      }
    };

    carouselRef.current?.addEventListener(
      "transitionend",
      transitionEndHandler
    );
    return () => {
      carouselRef.current?.removeEventListener(
        "transitionend",
        transitionEndHandler
      );
    };
  }, [
    currentIndex,
    isTransitioning,
    extendedProjects.length,
    projectsPerSlide,
  ]);

  return (
    <div className="relative overflow-hidden">
      <div
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${(currentIndex * 100) / projectsPerSlide}%)`,
        }}
      >
        {extendedProjects.map((project, index) => (
          <Card
            key={`${project.id}-${index}`}
            className="flex-shrink-0 w-1/3 bg-gray-900 overflow-hidden relative h-[400px] mx-2"
          >
            <div className="relative w-full h-3/4">
              <Image
                src={project.image}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <CardContent className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4 h-1/4">
              <CardTitle className="text-white text-lg">
                {project.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm">
                Goal: {project.goal} SOL | Raised: {project.raised} SOL
              </CardDescription>
              <div className="mt-2 h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${(project.raised / project.goal) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        variant="outline"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75"
        onClick={handlePrevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75"
        onClick={handleNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ProjectCarousel;
