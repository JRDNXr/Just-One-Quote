import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaRedo } from "react-icons/fa"; // Import moon, sun, and refresh icons from React Icons

const Main = () => {
    // Load dark mode setting from localStorage (default is false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [quotes, setQuotes] = useState([]);
    const [randomQuote, setRandomQuote] = useState(""); // State to store a single random quote when the component mounts
    const [isSpinning, setIsSpinning] = useState(false); // State to track if the refresh button should spin

    // https://type.fit/api/quotes

    useEffect(() => {
        fetch("/quotes.txt")
            .then((response) => response.text())
            .then((data) => {
                const quotesArray = data.split("\n").map((quote) => quote.trim()).filter((quote) => quote);
                setQuotes(quotesArray);
                setRandomQuote(quotesArray[Math.floor(Math.random() * quotesArray.length)]);
            })
            .catch((error) => console.error("Error loading quotes:", error));
    }, []);

    useEffect(() => {
        document.documentElement.style.backgroundColor = isDarkMode ? "#141f2c" : "#ecf0f1";
    }, [isDarkMode]);

    // Toggle dark mode state
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("darkMode", newMode);
            return newMode;
        });
    };

    // Refresh the page
    const refreshPage = () => {
        setIsSpinning(true); // Start spinning when the button is clicked
        window.location.reload();
    };

    const splitQuote = randomQuote.split("|");
    const quoteText = splitQuote[0]?.trim();
    const authorName = splitQuote[1]?.trim()

    return (
        <div
            style={{
                color: isDarkMode ? "#ecf0f1" : "#2c3e50",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontFamily: "'Arial', sans-serif",
                transition: "all 0.3s ease",
            }}
        >
            <div>
                <h1>{quoteText}</h1>
                {authorName && (
                    <p
                        style={{
                            fontStyle: "italic",
                            fontSize: "21px",
                            color: isDarkMode ? "#ecf0f1" : "#2c3e50",
                        }}
                    >
                        - {authorName}
                    </p>
                )}

                {/* Refresh button */}
                <button
                    onClick={refreshPage}
                    style={{
                        position: "fixed",
                        bottom: "100px", // Adjusted to move it higher
                        right: "20px",
                        padding: "20px",
                        fontSize: "30px",
                        cursor: "pointer",
                        backgroundColor: "#fff", // White background for the refresh button
                        border: "none",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70px", // Button size
                        height: "70px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    className={isSpinning ? "spinning" : ""}
                >
                    <FaRedo color="#000" size={24} />
                </button>

                {/* Dark mode button */}
                <button
                    onClick={toggleDarkMode}
                    style={{
                        position: "fixed",
                        bottom: "20px", // Dark mode button stays at the bottom
                        right: "20px", // Place it on the right
                        padding: "20px",
                        fontSize: "30px",
                        cursor: "pointer",
                        backgroundColor: isDarkMode ? "#fff" : "#000",
                        border: "none",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70px",
                        height: "70px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    {/* Icon: Moon for light mode, Sun for dark mode */}
                    {isDarkMode ? (
                        <FaSun
                            color="#000"
                            size={30}
                            style={{
                                animation: "fadeUp 0.5s forwards", // Sun comes from the top
                            }}
                        />
                    ) : (
                        <FaMoon
                            color="#fff"
                            size={30}
                            style={{
                                animation: "fadeDown 0.5s forwards", // Moon fades downwards
                            }}
                        />
                    )}
                </button>
            </div>

            <style jsx>{`
                @keyframes fadeUp {
                    0% {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeDown {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                .spinning {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Main;