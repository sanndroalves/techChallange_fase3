import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: Arial, sans-serif;
        background: #f5f7fa;
        color: #1f2937;
        line-height: 1.6;
    }

    button,
    input,
    textarea {
        font: inherit;
    }

    button {
        cursor: pointer;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    main {
        width: min(1100px, 92%);
        margin: 40px auto;
    }

    h1,
    h2,
    h3 {
        line-height: 1.2;
    }

    input,
    textarea {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: #ffffff;
        color: #1f2937;
        outline: none;
    }

    input:focus,
    textarea:focus {
        border-color: #2563eb;
    }

    textarea {
        min-height: 180px;
        resize: vertical;
    }

    button {
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        background: #2563eb;
        color: #ffffff;
    }

    button:hover {
        background: #1d4ed8;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    @media (max-width: 600px) {
        main {
            width: 94%;
            margin: 24px auto;
        }
    }
`

export default GlobalStyle