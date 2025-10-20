// Robust download helper that supports data: URIs, blob: URLs and normal http(s) URLs.
export async function downloadDataUri(dataUri: string, filename: string) {
    try {
        // If it's a data: URI (base64), convert to a Blob directly
        if (typeof dataUri === 'string' && dataUri.startsWith('data:')) {
            const comma = dataUri.indexOf(',');
            const header = dataUri.substring(0, comma);
            const base64 = dataUri.substring(comma + 1);
            const mimeMatch = header.match(/data:([^;]+);/);
            const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
            const byteString = atob(base64);
            const len = byteString.length;
            const u8 = new Uint8Array(len);
            for (let i = 0; i < len; i++) u8[i] = byteString.charCodeAt(i);
            const blob = new Blob([u8], { type: mime });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            return;
        }

        // If it's already a blob: URL, download directly
        if (typeof dataUri === 'string' && dataUri.startsWith('blob:')) {
            const a = document.createElement('a');
            a.href = dataUri;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            return;
        }

        // Otherwise try fetching it and convert to blob
        const res = await fetch(dataUri);
        if (!res.ok) throw new Error('Network response was not ok');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Download failed', err);
        alert('Failed to download file');
    }
}
