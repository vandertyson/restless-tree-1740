import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { groupByGenre } from "./lib/utils";
import Breadcrumbs from "./components/Breadcrumbs";
import Sidebar from "./components/Sidebar";
import BooksList from "./components/BooksList";
import BookDetail from "./components/BookDetail";
import MockDataBanner from "./components/MockDataBanner";
import { DataTabs } from "./components/DataTabs";
import { ChatBox } from "./components/ChatBox";


function App() {
  const navigate = useNavigate();
  const params = useParams();
  const [bookDetail, setBookDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [dataSource, setDataSource] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Get route parameters
  const { bookId } = params;
  const { genreId } = params;
  const activeGenre = genreId ? decodeURIComponent(genreId) : null;

  // Load genres for sidebar
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.books?.length) {
          console.error("No books data found:", typeof data);
          return;
        }

        const booksArray = data.books;

        // Check if using mock data or database
        if (data.source) {
          setDataSource(data.source);
        }

        const genreGroups = groupByGenre(booksArray);
        setGenres(genreGroups);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };

    loadGenres();
  }, []);

  // Load book details when a book is selected via URL
  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        // First get basic book details
        const bookResponse = await fetch(`/api/books/${bookId}`);

        if (!bookResponse.ok) {
          throw new Error(`API returned status: ${bookResponse.status}`);
        }

        const bookData = await bookResponse.json();

        // Then get related books data
        const relatedResponse = await fetch(`/api/books/${bookId}/related`);

        if (!relatedResponse.ok) {
          throw new Error(`API returned status: ${relatedResponse.status}`);
        }

        const relatedData = await relatedResponse.json();

        // Combine the data
        const combinedData = {
          book: bookData.book,
          relatedBooks: relatedData.relatedBooks,
          recentRecommendations: relatedData.recentRecommendations,
          genreStats: relatedData.genreStats,
        };

        setBookDetail(combinedData);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId]);

  const handleSelectBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleSelectGenre = (genre) => {
    if (genre) {
      navigate(`/genre/${encodeURIComponent(genre)}`);
    } else {
      navigate("/");
    }
  };

  // return (
  //   <div>
  //     <div className="flex h-screen">
  //       <div className="w-1/2 border-r">
  //         <DataTabs />
  //       </div>
  //       <div className="w-1/2">
  //         <ChatBox />
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      {/* Bảng dữ liệu: chỉ hiển thị trên màn hình >=768px */}
      {!isMobile && (
        <div className="md:w-1/2 h-full border-r overflow-auto">
          <DataTabs />
        </div>
      )}

      {/* Chat box: luôn full trên mobile, 1/2 trên desktop */}
      <div className="w-full md:w-1/2 h-full overflow-hidden">
        <ChatBox />
      </div>
    </div>
  )
}

export default App;
