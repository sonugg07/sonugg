import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { PortfolioData } from '@/types/portfolio';
import { initialPortfolioData } from '@/data/defaultData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');
const TMP_FILE_PATH = path.join('/tmp', 'portfolio.json');

// Helper: Upstash / Vercel KV REST helper
async function getFromRedis(): Promise<PortfolioData | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/sonugg_portfolio_data`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.result) {
      const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
      if (parsed && parsed.profile) return parsed;
    }
  } catch (err) {
    console.warn('Redis read failed:', err);
  }
  return null;
}

async function saveToRedis(data: PortfolioData): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return false;

  try {
    const res = await fetch(`${url}/set/sonugg_portfolio_data`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(data)),
    });
    return res.ok;
  } catch (err) {
    console.warn('Redis write failed:', err);
    return false;
  }
}

export async function GET() {
  try {
    // 1. Try Upstash / Vercel KV if available
    const redisData = await getFromRedis();
    if (redisData) {
      return NextResponse.json(redisData, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'X-Storage-Type': 'redis',
        },
      });
    }

    // 2. Try /tmp file cache (for warm serverless lambdas)
    try {
      const tmpContent = await fs.readFile(TMP_FILE_PATH, 'utf-8');
      const tmpData: PortfolioData = JSON.parse(tmpContent);
      if (tmpData && tmpData.profile) {
        return NextResponse.json(tmpData, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'X-Storage-Type': 'tmp',
          },
        });
      }
    } catch {
      // tmp file does not exist or unreadable, continue to project file
    }

    // 3. Try project directory data/portfolio.json
    try {
      const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
      const data: PortfolioData = JSON.parse(fileContent);
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'X-Storage-Type': 'local-file',
        },
      });
    } catch {
      // Return initial fallback data
      return NextResponse.json(initialPortfolioData, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'X-Storage-Type': 'fallback',
        },
      });
    }
  } catch (error) {
    console.error('Failed to read portfolio data:', error);
    return NextResponse.json(initialPortfolioData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body: PortfolioData = await request.json();

    // Basic structure validation
    if (!body.profile || !Array.isArray(body.projects) || !Array.isArray(body.socials)) {
      return NextResponse.json(
        { error: 'Invalid data format provided' },
        { status: 400 }
      );
    }

    // Always ensure updatedAt is fresh
    const updatedData: PortfolioData = {
      ...body,
      updatedAt: body.updatedAt || Date.now(),
      settings: {
        isWebsiteOnline: body.settings?.isWebsiteOnline !== false,
        maintenanceTitle: body.settings?.maintenanceTitle || 'Portfolio Temporarily Offline',
        maintenanceMessage: body.settings?.maintenanceMessage || 'Upgrading systems and deploying new Web3 features.',
      },
    };

    let savedTarget = 'none';

    // 1. Try saving to Upstash / Vercel KV
    const redisSaved = await saveToRedis(updatedData);
    if (redisSaved) {
      savedTarget = 'redis';
    }

    // 2. Try saving to project filesystem (works in local dev mode)
    try {
      await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
      await fs.writeFile(
        DATA_FILE_PATH,
        JSON.stringify(updatedData, null, 2),
        'utf-8'
      );
      savedTarget = savedTarget === 'redis' ? 'redis+local' : 'local';
    } catch (fsErr) {
      // Expected in serverless read-only environment
      console.warn('Cannot write to data/portfolio.json (read-only filesystem):', fsErr);
    }

    // 3. Try saving to /tmp directory (writable in serverless lambda)
    try {
      await fs.writeFile(
        TMP_FILE_PATH,
        JSON.stringify(updatedData, null, 2),
        'utf-8'
      );
      if (savedTarget === 'none') savedTarget = 'tmp';
    } catch (tmpErr) {
      console.warn('Cannot write to /tmp/portfolio.json:', tmpErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio data saved successfully',
      storage: savedTarget,
      data: updatedData,
    });
  } catch (error) {
    console.error('Failed to save portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to save portfolio data' },
      { status: 500 }
    );
  }
}

