
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Forward request to backend
        const response = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Backend error' }, { status: response.status });
        }

        // Forward the stream directly
        const headers = new Headers();
        headers.set('Content-Type', response.headers.get('Content-Type') || 'text/plain; charset=utf-8');
        const dataStreamHeader = response.headers.get('X-Vercel-Ai-Data-Stream');
        if (dataStreamHeader) {
            headers.set('X-Vercel-Ai-Data-Stream', dataStreamHeader);
        }

        return new Response(response.body, {
            headers,
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
