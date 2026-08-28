import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Make a HEAD request to get only headers, more efficient than GET
    // Follow redirects to get headers from the final destination
    // Add a timeout to prevent hanging requests
    const response = await fetch(parsedUrl.toString(), {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000) // 10 seconds timeout
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return NextResponse.json({ headers }, { status: response.status });

  } catch (error: any) {
    console.error('Error fetching headers:', error);
    let errorMessage = 'Failed to fetch headers.';

    if (error.name === 'AbortError') {
      errorMessage = 'Request timed out after 10 seconds.';
    } else if (error.cause && typeof error.cause === 'object' && 'code' in error.cause) {
      // Node.js fetch errors often have a 'cause' property
      if (error.cause.code === 'ENOTFOUND') {
        errorMessage = 'Host not found. Check the URL for typos or network issues.';
      } else if (error.cause.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused. The server might be down or blocking connections.';
      } else if (error.cause.code === 'UND_ERR_SOCKET') {
        errorMessage = 'Network error or invalid URL. Ensure the URL is accessible.';
      }
    } else if (error instanceof TypeError && error.message.includes('Failed to parse URL')) {
      errorMessage = 'Invalid URL format. Please provide a complete and valid URL (e.g., https://example.com).';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}