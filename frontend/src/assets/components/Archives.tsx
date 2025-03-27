import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/Archives.css";

function Archives() {
    const [name, setName] = useState("");
    const [userid, setUserid] = useState("");
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get("http://localhost:5000/api/protected", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setName(res.data.user.name);
                setUserid(res.data.user.id);
            })
            .catch((err) => {
                console.error("Error fetching user:", err);
            });

        // Fetch top books
        axios
            .get("http://localhost:5000/api/items")
            .then((res) => {
                setBooks(res.data); // Assuming the API returns an array of books
            })
            .catch((err) => {
                console.error("Error fetching books:", err);
            });
    }, []);

    // Scroll left and right functions
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    const handleSearch = () => {
        axios
            .get(`http://localhost:5000/api/search/${search}`) // Fix: Correct API endpoint
            .then((res) => {
                setBooks(res.data); // Assuming the API returns an array of books
            })
            .catch((err) => {
                console.error("Error fetching books:", err);
            });
        if (search == "" ){
            axios
            .get("http://localhost:5000/api/items")
            .then((res) => {
                setBooks(res.data); // Assuming the API returns an array of books
            })
            .catch((err) => {
                console.error("Error fetching books:", err);
            });
        }
    };

    const handleHeart = async (book) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/toggle-heart",
                {
                    user_id: userid,
                    book_id: book.id,
                },
                {
                    headers: { "Content-Type": "application/json" }, // Correct content type
                }
            );
    
            console.log("Response:", res.data);
        } catch (error) {
            console.error("Error toggling heart:", error.response?.data || error.message);
        }
    };

    const getHearts = () => {
        axios
            .get(`http://localhost:5000/api/hearts/${userid}`) // Fix: Correct API endpoint
            .then((res) => {
                setBooks(res.data); // Assuming the API returns an array of books
            })
            .catch((err) => {
                console.error("Error fetching books:", err);
            });
    };
    

  return (
    <div className="archives">
        <div className="upper_page">
            <div className="header">
                <div className="left-header">
                    <nav>
                    <ul>
                        <li>
                        <a href="http://localhost:5173/">Home</a>
                        </li>
                        <li>
                        <a href="http://localhost:5173/archives">Archives</a>
                        </li>
                    </ul>
                    </nav>
                </div>
                <div className="center-header">
                    <img src="src/assets/images/website logo inverted.png" alt="website_logo" />
                </div>
                <div className="right-header">
                    <nav>
                    <ul>
                        <li>
                        <a href="#">About</a>
                        </li>
                        <li>
                        <a href="http://localhost:5173/login">{name ? name : "Account"} </a>
                        </li>
                    </ul>
                    </nav>
                </div>
                <div className="header-gradient" />
            </div>
            <div className="archives-web-subtitle">
                <h1>ARCHIVES</h1>
            </div>
            <div className="archives-search-bar-section">
                <div className="archives-search-bar">
                <img
                    src="src/assets/images/magnifying-glass-black.png"
                    alt="magnifying glass"
                />
                <input type="text" placeholder="Search Me Up" onChange={(e) => setSearch(e.target.value)}/>
                <button className="search-btn" onClick={handleSearch}>Search</button>
                </div>
                <div className="archives-hearts">
                    <button><img src="src/assets/images/heart-icon-filled.png" alt="" onClick={getHearts}/></button>
                </div>
            </div>
            <div className="archives-main-section">
                <div className="archives-main-content">
                    <div className="archives-category-section">
                        <h2>CATEGORIES</h2>
                        <div className="archives-category-list">
                            <a href="#">Fiction</a>
                            <a href="#">Non-Fiction</a>
                            <a href="#">Biographies</a>
                            <a href="#">Business</a>
                            <a href="#">Education</a>
                            <a href="#">Health & Fitness</a>
                            <a href="#">Kids</a>
                            <a href="#">Sports & Recreation</a>
                            <a href="#">Technology</a>
                            <a href="#">World</a>
                        </div>
                    </div>
                    <div className="archives-section">
                        <h1>TOP BOOKS</h1>
                        <div className="archives-book-list" ref={scrollRef}>
                            {books.map((book) => (
                                <div className="archives-book-card" key={book.id}>
                                    <img
                                    src={book.image_path ? `http://localhost:5000${book.image_path}` : "src/assets/images/books/placeholder.jpg"}
                                    alt={book.title}
                                    className="book-cover"
                                    />  
                                    <div className="book-info">
                                        <h2>{book.title}</h2>
                                        <div className="book-buttons">
                                            <button onClick={() => handleHeart(book)} className="heart-btn"> <img src="src/assets/images/heart-icon.png" alt="" /> </button>
                                            <button className="archives-read"onClick={() => window.location.href = `/book/${book.id}`}>Read</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="archives-lower_page">

            <div className="archives-footer">
            <div className="archives-footer-section">
                <nav>
                <h1>Discover</h1>
                <ul>
                    <li>
                    <a href="#">Home</a>
                    </li>
                    <li>
                    <a href="#">Books</a>
                    </li>
                    <li>
                    <a href="#">Authors</a>
                    </li>
                    <li>
                    <a href="#">Subjects</a>
                    </li>
                    <li>
                    <a href="#">Collections</a>
                    </li>
                    <li>
                    <a href="#">Advanced Search</a>
                    </li>
                </ul>
                </nav>
            </div>
            <div className="archives-footer-section">
                <nav>
                <h1>Help</h1>
                <ul>
                    <li>
                    <a href="#">Help Center</a>
                    </li>
                    <li>
                    <a href="#">Contact Us</a>
                    </li>
                    <li>
                    <a href="#">Suggesting Edits</a>
                    </li>
                    <li>
                    <a href="#">Add a Book</a>
                    </li>
                    <li>
                    <a href="#">Release Notes</a>
                    </li>
                </ul>
                </nav>
            </div>
            <div className="archives-footer-section">
                <nav>
                <h1>Legal</h1>
                <ul>
                    <li>
                    <a href="#">Terms of service</a>
                    </li>
                    <li>
                    <a href="#">Privacy Policy</a>
                    </li>
                    <li>
                    <a href="#">Cookie Policy</a>
                    </li>
                    <li>
                    <a href="#">Disclaimer</a>
                    </li>
                    <li>
                    <a href="#">DMCA Policy</a>
                    </li>
                </ul>
                </nav>
            </div>
            <div className="archives-footer-logo">
                <img src="src/assets/images/website logo inverted.png" alt="website_logo" />
                <div className="archives-footer-logo-text">
                <div className="archives-footer-logo-title">
                    <h1>FUTURE-ED</h1>
                </div>
                <div className="archives-footer-logo-subtitle">
                    <h2>ARCHIVE</h2>
                </div>
                </div>
            </div>
            </div>
            <div className="archives-footer-logo-messege">
            <p>© 2025 Future-ED. All rights reserved.</p>
            </div>
        </div>
    </div>

  );
}

export default Archives;
