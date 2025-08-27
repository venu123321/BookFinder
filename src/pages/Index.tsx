import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { BookCard } from "@/components/BookCard";
import { BookDetailsModal } from "@/components/BookDetailsModal";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowUp, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  isbn?: string[];
  publisher?: string[];
  publish_date?: string[];
  language?: string[];
  number_of_pages_median?: number;
}

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSearch = async (query: string, type: string) => {
    setIsLoading(true);
    setCurrentQuery(query);
    setHasSearched(true);

    try {
      const searchParam = type === "title" ? "title" : 
                         type === "author" ? "author" : "subject";
      
      const response = await fetch(
        `https://openlibrary.org/search.json?${searchParam}=${encodeURIComponent(query)}&limit=24`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBooks(data.docs || []);
      
      if (data.docs?.length === 0) {
        toast({
          title: "No books found",
          description: `No results found for "${query}". Try a different search term.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${data.docs.length} books for "${query}"`,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "There was an error searching for books. Please try again.",
        variant: "destructive",
      });
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToHome = () => {
    setHasSearched(false);
    setBooks([]);
    setCurrentQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {!hasSearched && <Hero onStartSearch={scrollToSearch} />}
      
      <div ref={searchRef} className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          {hasSearched && (
            <div className="flex justify-center gap-4 mb-4">
              <Button
                onClick={goToHome}
                variant="outline"
                className="flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                onClick={scrollToTop}
                variant="ghost"
                className="flex items-center"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Back to Top
              </Button>
            </div>
          )}
          <h2 className="text-3xl font-bold mb-4">
            {hasSearched ? `Search Results${currentQuery ? ` for "${currentQuery}"` : ""}` : "Search Books"}
          </h2>
          <p className="text-muted-foreground mb-8">
            Explore millions of books from the Open Library
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Searching for books...</p>
          </div>
        )}

        {hasSearched && !isLoading && books.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or search type.</p>
          </div>
        )}

        {books.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {books.map((book) => (
              <BookCard key={book.key} book={book} onBookClick={handleBookClick} />
            ))}
          </div>
        )}
      </div>

      <BookDetailsModal 
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
