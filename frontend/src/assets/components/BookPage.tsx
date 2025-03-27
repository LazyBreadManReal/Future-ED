import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/BookPage.css";

function BookPage() {
    const [name, setName] = useState("");
    const [userid, setUserid] = useState("");
    const { id } = useParams(); // Get book ID from URL
    const [book, setBook] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/book/${id}`)
            .then((res) => setBook(res.data))
            .catch((err) => console.error("Error fetching book details:", err));

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
    }, [id]);

    if (!book) return <p>Loading book details...</p>;

    return (
        <div className="book-page">
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
            <div className="book-page-section">
                <div className="book-page-container">
                    <div className="book">
                        <img
                            src={book.image_path ? `http://localhost:5000${book.image_path}` : "/assets/placeholder.jpg"}
                            alt={book.title}
                            className="book-page-cover"
                        />
                        <div className="book-page-details">
                            <h1>{book.title}</h1>
                            <h2>{book.author}</h2>
                            <p>{book.description}</p>
                            <button className="read-btn">Read</button>
                        </div>
                    </div>
                </div>
            </div>
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
    );
}

export default BookPage;
