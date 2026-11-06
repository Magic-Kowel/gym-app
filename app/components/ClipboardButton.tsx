import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { IconButton } from '@mui/material';
import { useState } from 'react';

function ClipboardButton({ text }: { text: string }) {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = async (textToCopy: string) => {
        try {
            // 🟢 Usamos la API del navegador para copiar al portapapeles
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);

            // Opcional: Regresa el ícono original después de 2 segundos para mejor UX
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Error al copiar al portapapeles: ", err);
        }
    };

    return (
        <IconButton aria-label="copy" size="small" onClick={() => handleCopy(text)}>
            {copied ? <FileCopyIcon /> : <ContentCopyIcon />}
        </IconButton>
    );
}

export default ClipboardButton;