"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Terminal.module.css";
import TerminalOutput from "./TerminalOutput";

export default function Terminal() {
    const [history, setHistory] = useState([
        {
            type: "output", content: `Last login: Tue Nov 19 22:57:35 on ttys001`
        },
        { type: "output", content: "Welcome. Type 'help' for available commands." },
    ]);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [history, isProcessing, input]);

    const handleCommand = async (cmd) => {
        const trimmedCmd = cmd.trim();
        if (!trimmedCmd) return;

        const newHistory = [...history, { type: "command", content: cmd }];
        setHistory(newHistory);
        setCommandHistory((prev) => [...prev, trimmedCmd]);
        setHistoryIndex(-1);
        setInput("");
        setIsProcessing(true);

        const lowerCmd = trimmedCmd.toLowerCase();

        // Deterministic Commands
        if (lowerCmd === "clear") {
            setHistory([]);
            setIsProcessing(false);
            return;
        }

        if (lowerCmd === "help") {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `
  >> AVAILABLE COMMANDS <<
  
  about       : System identity and bio
  skills      : Technical capabilities matrix
  projects    : Project deployment logs
  resume      : Download PDF Resume
  contact     : Communication channels
  clear       : Purge terminal history
  [query]     : Ask Naman_OS anything (AI Powered)
          `,
                },
            ]);
            setIsProcessing(false);
            return;
        }

        if (lowerCmd === "about") {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `
  >> IDENTITY_VERIFIED: Naman Agnihotri
  >> ROLE: AI Engineer & Full Stack Developer
  
  Passionate about building intelligent systems and seamless user experiences.
  Specializing in Generative AI, Next.js, and Python.
  Currently optimizing neural pathways for maximum efficiency.
                    `,
                },
            ]);
            setIsProcessing(false);
            return;
        }

        if (lowerCmd === "skills") {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `
  >> SKILLS_MATRIX LOADED
  
  > LANGUAGES  : Python, JavaScript, TypeScript, C++, SQL
  > FRONTEND   : React, Next.js, Tailwind CSS, HTML5/CSS3
  > BACKEND    : Node.js, Express, FastAPI, Django
  > AI/ML      : PyTorch, TensorFlow, LangChain, Hugging Face
  > TOOLS      : Git, Docker, AWS, Firebase, Vercel
                    `,
                },
            ]);
            setIsProcessing(false);
            return;
        }

        if (lowerCmd === "projects") {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `
  >> PROJECT_LOGS RETRIEVED
  
  1. [BROWSER_AUTOMATION] : LLM-driven Chrome extension (FastAPI + Gemini 2.5)
  2. [CODE_GENERATOR]     : Frontend-to-Backend API generator (GPT-4.1 + Claude 3.7)
  3. [EXAM_ASSESSMENT]    : Patent-pending OCR-free grading system (Multimodal LLM)
  4. [CLI_ASSISTANT]      : Coding Assistant CLI with memory (Gemini 2.5 + Pinecone)
  5. [GUIDO_AI]           : RAG-based Career Guidance Chatbot (NLP)
  
  Type "tell me about [project]" for more details.
                    `,
                },
            ]);
            setIsProcessing(false);
            return;
        }

        if (lowerCmd === "resume") {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `
  >> INITIATING_DOWNLOAD...
  [FILE] Naman_AI_Engineer_CV.pdf
  [STATUS] Transfer complete.
          `,
                },
            ]);
            window.open("/Naman_AI_Engineer_CV.pdf", "_blank");
            setIsProcessing(false);
            return;
        }

        if (lowerCmd === "contact") {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `
  >> COMM_LINKS ESTABLISHED
  
  [EMAIL]    namanagnihotri280@gmail.com
  [LINKEDIN] linkedin.com/in/naman-agnihotri
  [GITHUB]   github.com/Naman7214
  [PHONE]    +91 8830069926
          `,
                },
            ]);
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: trimmedCmd }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Unknown error");
            }

            // Create a new history entry for the response
            setHistory((prev) => [...prev, { type: "output", content: "" }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                setHistory((prev) => {
                    const newHistory = [...prev];
                    const lastIndex = newHistory.length - 1;
                    newHistory[lastIndex] = {
                        ...newHistory[lastIndex],
                        content: newHistory[lastIndex].content + chunk,
                    };
                    return newHistory;
                });
            }

        } catch (error) {
            setHistory((prev) => [
                ...prev,
                {
                    type: "output",
                    content: `
  >> [SYSTEM_ALERT] :: CONNECTION_LOST
  Unable to reach Naman_OS neural network.
  
  Please utilize standard hardcoded commands:
  > help
  > about
  > skills
  > projects
  > resume
  > contact
                    `
                },
            ]);
        } finally {
            setIsProcessing(false);
            // Keep focus on input
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isProcessing) {
            handleCommand(input);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length === 0) return;
            const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (commandHistory.length === 0 || historyIndex === -1) return;
            const newIndex = historyIndex + 1;
            if (newIndex >= commandHistory.length) {
                setHistoryIndex(-1);
                setInput("");
            } else {
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        }
    };

    // Fix for mobile: Keep cursor at the end
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.selectionStart = inputRef.current.value.length;
            inputRef.current.selectionEnd = inputRef.current.value.length;
        }
    }, [input]);

    return (
        <div className={styles.terminalContainer} onClick={() => inputRef.current?.focus()}>
            <div className={styles.header}>
                <div className={styles.windowControls}>
                    <div className={`${styles.control} ${styles.close}`}></div>
                    <div className={`${styles.control} ${styles.minimize}`}></div>
                    <div className={`${styles.control} ${styles.maximize}`}></div>
                </div>
                <div className={styles.title}>naman_agnihotri — -zsh — 80x24</div>
            </div>

            <div
                className={styles.terminalBody}
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((line, index) => (
                    <TerminalOutput key={index} line={line} />
                ))}

                {!isProcessing && (
                    <div className={styles.inputLine}>
                        <span className={styles.prompt}>visitor@portfolio:~$</span>
                        <span className={styles.inputText}>{input}</span>
                        <span className={styles.cursor}></span>
                        <input
                            ref={inputRef}
                            type="text"
                            className={styles.hiddenInput}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                        />
                    </div>
                )}
                {isProcessing && <div className={styles.loading}>_</div>}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
