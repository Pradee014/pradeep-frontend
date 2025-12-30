const fetch = require('node-fetch');

async function testChat() {
    const url = 'http://localhost:3000/api/chat';
    console.log(`Sending request to ${url}...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });

        console.log('Response Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.body) {
            console.log('No response body');
            return;
        }

        // Node-fetch returns a NodeJS Readable stream
        for await (const chunk of response.body) {
            console.log('CHUNK:', chunk.toString());
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testChat();
