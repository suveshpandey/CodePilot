import axios from "axios";
import { Language } from "./types";
import { LANGUAGE_VERSION } from "./constants";
import { stdin } from "process";

interface ExecuteCodeInterface {
    sourceCode: string | undefined,
    language: Language,
    userInput: string| undefined
}

export const executeCode = async ({sourceCode, language, userInput}: ExecuteCodeInterface) => {
    try {
        const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: language,
        version: LANGUAGE_VERSION[language],
        files: [
            {
                content: sourceCode
            }
        ],
        stdin: userInput
        });
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.error(err);
    }
}