import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  isbn?: string[];
}

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
}

export const BookCard = ({ book, onBookClick }: BookCardProps) => {
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "/placeholder.svg";

  const authors = book.author_name?.slice(0, 2).join(", ") || "Unknown Author";
  const subjects = book.subject?.slice(0, 3) || [];

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 animate-fade-in cursor-pointer"
          onClick={() => onBookClick(book)}>
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={coverUrl}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-card-foreground line-clamp-2 mb-2 leading-tight">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          by {authors}
        </p>
        {book.first_publish_year && (
          <p className="text-xs text-muted-foreground mb-3">
            Published: {book.first_publish_year}
          </p>
        )}
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {subjects.map((subject, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                {subject}
              </Badge>
            ))}
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onBookClick(book);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};