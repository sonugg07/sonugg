import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { PortfolioData } from '@/types/portfolio';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const data: PortfolioData = JSON.parse(fileContent);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Failed to read portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to read portfolio data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const updatedData: PortfolioData = await request.json();

    // Basic structure validation
    if (!updatedData.profile || !Array.isArray(updatedData.projects) || !Array.isArray(updatedData.socials)) {
      return NextResponse.json(
        { error: 'Invalid data format provided' },
        { status: 400 }
      );
    }

    // Ensure directory exists
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });

    // Write formatted JSON to disk
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(updatedData, null, 2),
      'utf-8'
    );

    return NextResponse.json({
      success: true,
      message: 'Portfolio data saved successfully to disk',
      data: updatedData,
    });
  } catch (error) {
    console.error('Failed to save portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to save portfolio data to disk' },
      { status: 500 }
    );
  }
}
