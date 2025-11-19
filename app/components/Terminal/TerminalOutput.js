import styles from "./Terminal.module.css";

export default function TerminalOutput({ line }) {
    if (line.type === "command") {
        return (
            <div className={styles.outputLine}>
                <span className={styles.prompt}>visitor@portfolio:~$</span>
                <span className={styles.commandLine}>{line.content}</span>
            </div>
        );
    }

    return (
        <div className={`${styles.outputLine} ${styles.responseLine}`}>
            {line.content}
        </div>
    );
}
