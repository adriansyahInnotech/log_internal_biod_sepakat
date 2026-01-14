import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = process.env.BACKEND_API_URL;
    if (!baseUrl) {
      throw new Error('BACKEND_API_URL is not defined');
    }

    const prefix = process.env.PREFIX;
    if (!prefix) {
      throw new Error('PREFIX is not defined');
    }

    const full_url = `${baseUrl}/api/biod/v1/log_internal/${prefix}`;

    console.log(full_url);

    const response = await fetch(full_url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      {
        status_code: 500,
        message: 'Failed to fetch data from backend service',
        data: [],
        trace_id: '',
      },
      { status: 500 }
    );
  }
}
