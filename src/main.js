import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaRedo, FaCopy, FaCheck } from "react-icons/fa"; // Import moon, sun, refresh, copy, and
// checkmark icons from React Icons
import './styles/main.css';

const Main = () => {
    // Load dark mode setting from localStorage (default is false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [quotes, setQuotes] = useState([]);
    const [randomQuote, setRandomQuote] = useState(""); // State to store a single random quote when the component mounts
    const [isSpinning, setIsSpinning] = useState(false); // State to track if the refresh button should spin
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false); // State to track if the copy button was clicked
    const [isAnimating, setIsAnimating] = useState(false); // State to track if the background is animating
    const [textColorClass, setTextColorClass] = useState(""); // State to track the text color class

    const splitQuote = randomQuote.split("|");
    const quoteText = splitQuote[0]?.trim();
    const authorName = splitQuote[1]?.trim()

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

    const handleClick = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        refreshQuote();
        setTimeout(() => setIsSpinning(false), 1000);
    }

    // Refresh Quote
    const refreshQuote = () => {
        //if (isSpinning) return; // Prevent refreshing while animating

        //setIsSpinning(true); // Start spinning when the button is clicked

        // Get a random quote from the quotes array
        const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setRandomQuote(newQuote);

        // Stop spinning after a short delay
        //setTimeout(() => setIsSpinning(false), 1000);
    };

    // Copy Quote
    const copyToClipboard = () => {
        if (copied) return; // Prevent toggling while animating

        const fullQuote = authorName ? `${quoteText} - ${authorName}` : quoteText;
        navigator.clipboard.writeText(fullQuote)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error("Failed to copy:", err));
    };

    // Dark Mode / Light Mode Toggle
    const toggleDarkMode = () => {
        if (isAnimating) return; // Prevent toggling while animating

        setIsAnimating(true);
        setTimeout(() => {
            setTextColorClass(isDarkMode ? "light-text" : "dark-text");
        }, 380); // Halfway through the animation
        setTimeout(() => {
            setIsDarkMode((prevMode) => {
                const newMode = !prevMode;
                localStorage.setItem("darkMode", newMode);
                return newMode;
            });
            setIsAnimating(false);
        }, 1000); // Duration of the wipe animation
    };

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
            {isAnimating && (
                <div className="wipe-overlay" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: isDarkMode ? "#ecf0f1" : "#141f2c",
                    animation: isDarkMode ? "wipeUp 1s forwards" : "wipeDown 1s forwards",
                    zIndex: 1,
                }}></div>
            )}
            <div style={{ position: "relative", zIndex: 2 }}>
                <h1 className={textColorClass}>{quoteText}</h1>
                {authorName && (
                    <p
                        className={textColorClass}
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
                    onClick={handleClick}
                    disabled={isSpinning}
                    style={{
                        position: "fixed",
                        bottom: "180px",
                        right: "20px",
                        padding: "20px",
                        fontSize: "30px",
                        cursor: isSpinning ? "not-allowed" : "pointer",
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70px",
                        height: "70px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: isSpinning ? "none" : "transform 0.2s ease-in-out",
                        opacity: isSpinning ? 0.5 : 1,
                        pointerEvents: isSpinning ? "none" : "auto",
                        transform: isSpinning ? "scale(1)" : undefined,
                    }}
                    onMouseEnter={(e) => {
                        if (!isSpinning) e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    className={`refresh-button ${isSpinning ? "spinning" : ""}`}
                >
                    <FaRedo color="#000" size={24} className={isSpinning ? "spinning" : ""} />
                    {!isSpinning && <div className="tooltip">Refresh Quote</div>}
                </button>

                {/* Copy button */}
                <button
                    onClick={copyToClipboard}
                    disabled={copied}
                    style={{
                        position: "fixed",
                        bottom: "100px",
                        right: "20px",
                        padding: "20px",
                        fontSize: "30px",
                        cursor: "pointer",
                        backgroundColor: copied ? "#4caf50" : "#fff",
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
                    className={copied ? "copied" : ""}
                >
                    {copied ? (
                        <FaCheck
                            color="#fff"
                            size={24}
                            style={{
                                animation: "checkmarkAnim 0.5s ease-out",
                            }}
                        />
                    ) : (
                        <FaCopy color="#000" size={24} />
                    )}
                    <div className="tooltip">Copy Quote</div>
                </button>

                {/* Dark mode button */}
                <button
                    onClick={toggleDarkMode}
                    disabled={isAnimating}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
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
                        opacity: isAnimating ? 0.5 : 1, // Optional: Add slight opacity to show it's disabled
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
                    <div className="tooltip">
                        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Main;