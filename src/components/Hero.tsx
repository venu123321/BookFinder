import { BookOpen, Search, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/library-hero.jpg";

interface HeroProps {
  onStartSearch: () => void;
}

export const Hero = ({ onStartSearch }: HeroProps) => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful academic library"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-primary-foreground px-6 max-w-4xl">
        <div className="animate-fade-in">
          <BookOpen className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Next
            <span className="block bg-gradient-to-r from-accent-glow to-accent bg-clip-text text-transparent">
              Great Read
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Discover millions of books from the Open Library. Search by title, author, or subject to find exactly what you're looking for.
          </p>
          <Button
            onClick={onStartSearch}
            variant="accent"
            size="lg"
            className="text-lg px-8 py-6 h-auto animate-slide-up"
          >
            <Search className="h-5 w-5 mr-2" />
            Start Exploring Books
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 animate-slide-up">
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-bold">Millions</div>
            <div className="text-sm opacity-80">of Books</div>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-bold">Thousands</div>
            <div className="text-sm opacity-80">of Authors</div>
          </div>
          <div className="text-center">
            <Award className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <div className="text-2xl font-bold">Free</div>
            <div className="text-sm opacity-80">to Access</div>
          </div>
        </div>
      </div>
    </section>
  );
};