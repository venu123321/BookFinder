import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, Users, Hash, ExternalLink } from "lucide-react";

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

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

interface BookDetails {
  description?: {
    value?: string;
    type?: string;
  } | string;
  subjects?: string[];
  first_sentence?: {
    value?: string;
  } | string;
  excerpts?: Array<{
    excerpt?: string;
  }>;
}

export const BookDetailsModal = ({ book, isOpen, onClose }: BookDetailsModalProps) => {
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (book && isOpen) {
      fetchBookDetails(book.key);
    }
  }, [book, isOpen]);

  const fetchBookDetails = async (bookKey: string) => {
    setIsLoadingDetails(true);
    try {
      const response = await fetch(`https://openlibrary.org${bookKey}.json`);
      if (response.ok) {
        const data = await response.json();
        setBookDetails(data);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (!book) return null;

  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "/placeholder.svg";

  const authors = book.author_name?.slice(0, 5).join(", ") || "Unknown Author";
  const subjects = book.subject?.slice(0, 10) || [];
  const publishers = book.publisher?.slice(0, 3).join(", ") || "Unknown Publisher";
  const languages = book.language?.slice(0, 3).join(", ") || "Unknown";

  const getDescription = () => {
    if (!bookDetails?.description) return null;
    
    if (typeof bookDetails.description === 'string') {
      return bookDetails.description;
    }
    
    if (bookDetails.description.value) {
      return bookDetails.description.value;
    }
    
    return null;
  };

  const getFirstSentence = () => {
    if (!bookDetails?.first_sentence) return null;
    
    if (typeof bookDetails.first_sentence === 'string') {
      return bookDetails.first_sentence;
    }
    
    if (bookDetails.first_sentence.value) {
      return bookDetails.first_sentence.value;
    }
    
    return null;
  };

  const openLibraryUrl = `https://openlibrary.org${book.key}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold line-clamp-2">{book.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] overflow-hidden rounded-lg border">
                <img
                  src={coverUrl}
                  alt={`Cover of ${book.title}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              
              <div className="mt-4 space-y-2">
                <Button asChild className="w-full" variant="outline">
                  <a href={openLibraryUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Open Library
                  </a>
                </Button>
              </div>
            </div>

            {/* Book Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Authors:</span>
                  <span>{authors}</span>
                </div>
                
                {book.first_publish_year && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">First Published:</span>
                    <span>{book.first_publish_year}</span>
                  </div>
                )}
                
                {publishers && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">Publishers:</span>
                    <span>{publishers}</span>
                  </div>
                )}
                
                {book.number_of_pages_median && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">Pages:</span>
                    <span>{book.number_of_pages_median}</span>
                  </div>
                )}
                
                {languages && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-medium">Languages:</span>
                    <span>{languages}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              {isLoadingDetails ? (
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ) : (
                <div className="space-y-4">
                  {getDescription() && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {getDescription()}
                      </p>
                    </div>
                  )}
                  
                  {getFirstSentence() && (
                    <div>
                      <h4 className="font-semibold mb-2">First Sentence</h4>
                      <p className="text-muted-foreground leading-relaxed italic">
                        "{getFirstSentence()}"
                      </p>
                    </div>
                  )}
                  
                  {bookDetails?.excerpts && bookDetails.excerpts.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Excerpt</h4>
                      <p className="text-muted-foreground leading-relaxed italic">
                        "{bookDetails.excerpts[0].excerpt}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Subjects */}
              {subjects.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* ISBN */}
              {book.isbn && book.isbn.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">ISBN</h4>
                  <div className="flex flex-wrap gap-2">
                    {book.isbn.slice(0, 3).map((isbn, index) => (
                      <Badge key={index} variant="outline" className="font-mono text-xs">
                        {isbn}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};