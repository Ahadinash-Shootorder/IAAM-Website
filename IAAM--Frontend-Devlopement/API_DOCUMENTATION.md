# API Documentation

## Overview

The IAAM website uses a decoupled CMS architecture where the Next.js frontend communicates with a Strapi backend via REST API. This document details all API endpoints, request/response formats, and integration patterns.

## Base Configuration

### API Endpoints
- **Development**: `http://localhost:1337`
- **Staging/Testing**: `http://13.53.89.25:1337`
- **Production**: (To be configured)

### Environment Variable
```bash
NEXT_PUBLIC_STRAPI_URL=http://13.53.89.25:1337
```

### API Path Format
```
{BASE_URL}/api/{endpoint}
```

## Authentication

### Current Status
⚠️ **No authentication currently required** for GET requests

### When Implemented
```bash
# Include Bearer token in headers
Authorization: Bearer YOUR_API_TOKEN

# Example:
curl -H "Authorization: Bearer abc123xyz" \
  http://13.53.89.25:1337/api/events
```

### API Key Management (Future)
```javascript
// src/lib/apiClient.ts
const headers = {
  'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
  'Content-Type': 'application/json',
};

const response = await fetch(url, { headers });
```

## Core Endpoints

### 1. Events Endpoint

#### Get All Events
```
GET /api/events
```

**Query Parameters**:
```
?populate=*              # Populate all relations
?sort=date:desc         # Sort by date descending
?pagination[pageSize]=10 # Limit results
?pagination[page]=1     # Page number
?filters[status]=published # Filter by status
```

**Example Request**:
```bash
curl "http://13.53.89.25:1337/api/events?populate=*&sort=date:desc"
```

**Example Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Annual Conference 2024",
        "slug": "annual-conference-2024",
        "description": "Join us for our annual conference...",
        "content": "Detailed event content...",
        "date": "2024-06-15T09:00:00.000Z",
        "endDate": "2024-06-15T17:00:00.000Z",
        "location": "San Francisco, CA",
        "capacity": 500,
        "registeredAttendees": 342,
        "image": {
          "data": {
            "id": 5,
            "attributes": {
              "url": "/uploads/event_cover_abc123.jpg",
              "alternativeText": "Conference venue",
              "width": 1200,
              "height": 600
            }
          }
        },
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Conferences"
            }
          }
        },
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-20T14:30:00.000Z",
        "publishedAt": "2024-01-15T10:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 2,
      "total": 45
    }
  }
}
```

#### Get Single Event
```
GET /api/events/{id}
GET /api/events?filters[slug]={slug}
```

**Example Request**:
```bash
curl "http://13.53.89.25:1337/api/events/1?populate=*"
```

**Example Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Annual Conference 2024",
      "slug": "annual-conference-2024",
      // ... (same as above)
    }
  }
}
```

#### Create Event (Admin Only)
```
POST /api/events
Content-Type: application/json
Authorization: Bearer {token}

{
  "data": {
    "title": "New Event",
    "slug": "new-event",
    "description": "Event description",
    "date": "2024-12-01T09:00:00Z",
    "location": "New York, NY"
  }
}
```

### 2. News/Blog Endpoint

#### Get All News
```
GET /api/news
```

**Query Parameters**:
```
?populate=*
?sort=publishedAt:desc
?pagination[pageSize]=10
?filters[status]=published
```

**Example Response**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "New Partnership Announcement",
        "slug": "new-partnership-announcement",
        "excerpt": "We're excited to announce...",
        "content": "Full article content...",
        "author": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "John Doe",
              "email": "john@example.com"
            }
          }
        },
        "featuredImage": {
          "data": {
            "id": 10,
            "attributes": {
              "url": "/uploads/news_abc123.jpg"
            }
          }
        },
        "category": {
          "data": {
            "id": 2,
            "attributes": {
              "name": "Partnerships"
            }
          }
        },
        "publishedAt": "2024-01-20T10:00:00.000Z",
        "createdAt": "2024-01-20T08:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 47
    }
  }
}
```

### 3. Pages Endpoint

#### Get Dynamic Page
```
GET /api/pages?filters[slug]={slug}&populate=*
```

**Example**:
```bash
curl "http://13.53.89.25:1337/api/pages?filters[slug]=about&populate=*"
```

**Example Response**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "About IAAM",
        "slug": "about",
        "content": "Page content...",
        "sections": [
          {
            "id": 1,
            "title": "Our Mission",
            "content": "Section content..."
          }
        ],
        "publishedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  ]
}
```

### 4. Home Page Sections

#### Get Home Content
```
GET /api/home?populate=*
```

**Response includes**:
- Hero section
- About section
- Events showcase
- News section
- Join/CTA section

**Example Response**:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "heroSection": {
        "title": "Welcome to IAAM",
        "subtitle": "Leading International Association",
        "backgroundImage": { "data": { "attributes": { "url": "..." } } }
      },
      "aboutSection": {
        "title": "About Us",
        "content": "..."
      },
      "eventsShowcase": {
        "title": "Upcoming Events",
        "events": { "data": [...] }
      },
      "newsSection": {
        "title": "Latest News",
        "articles": { "data": [...] }
      },
      "ctaSection": {
        "title": "Join Us",
        "buttonText": "Become a Member"
      }
    }
  }
}
```

## Implementation Examples

### Fetching Events in Next.js

#### Using Async Component
```typescript
// src/components/EventsList.tsx
import { fetchStrapiData } from '@/lib/strapi';

interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  location: string;
  image: {
    url: string;
  };
}

interface StrapiResponse {
  data: Array<{
    id: number;
    attributes: Event;
  }>;
}

export default async function EventsList() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/events?populate=*&sort=date:desc`,
      { next: { revalidate: 3600 } } // ISR: Revalidate every hour
    );

    if (!response.ok) throw new Error('Failed to fetch events');

    const { data }: StrapiResponse = await response.json();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(({ id, attributes }) => (
          <article key={id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${attributes.image.url}`}
              alt={attributes.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{attributes.title}</h3>
              <p className="text-gray-600 mb-2">{attributes.location}</p>
              <p className="text-sm text-gray-500">
                {new Date(attributes.date).toLocaleDateString()}
              </p>
            </div>
          </article>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return <div>Failed to load events</div>;
  }
}
```

#### Using Client Component with useEffect
```typescript
// src/components/EventsClient.tsx
'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: number;
  title: string;
  location: string;
}

export default function EventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/events?populate=*`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const { data } = await response.json();
        setEvents(data.map((item: any) => item.attributes));
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.title}</li>
      ))}
    </ul>
  );
}
```

### Utility Function for API Calls

```typescript
// src/lib/strapi.ts
interface FetchOptions extends RequestInit {
  revalidate?: number;
}

export async function fetchStrapiData<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_STRAPI_URL is not defined');
  }

  const url = `${baseUrl}/api/${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
    next: {
      revalidate: options.revalidate || 60, // ISR default
    },
  });

  if (!response.ok) {
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Usage
const events = await fetchStrapiData('events?populate=*&sort=date:desc');
const singleEvent = await fetchStrapiData('events/1?populate=*');
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid request body",
    "details": {
      "errors": [
        {
          "path": ["title"],
          "message": "Title is required"
        }
      ]
    }
  }
}
```

#### 401 Unauthorized
```json
{
  "data": null,
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Invalid token"
  }
}
```

#### 404 Not Found
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Resource not found"
  }
}
```

#### 500 Server Error
```json
{
  "data": null,
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "An unexpected error occurred"
  }
}
```

### Error Handling Pattern

```typescript
// src/lib/apiClient.ts
export async function safeApiCall<T>(
  fetchFn: () => Promise<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await fetchFn();
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('API Error:', message);
    return { data: null, error: message };
  }
}

// Usage
const { data: events, error } = await safeApiCall(() =>
  fetchStrapiData('events?populate=*')
);

if (error) {
  console.error('Failed to fetch events:', error);
  // Show error to user
}
```

## Rate Limiting

### Current Limits
⚠️ **Not currently configured** - will be implemented in production

### Recommended Configuration
```javascript
// Future implementation
const RATE_LIMIT = {
  requests: 100,
  window: 60000, // 1 minute
};
```

### Handling Rate Limit
```javascript
// Exponential backoff retry logic
async function fetchWithRetry(
  url: string,
  maxRetries = 3,
  delay = 1000
): Promise<Response> {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        // Rate limited
        if (i < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, delay * Math.pow(2, i))
          );
          continue;
        }
      }

      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
```

## Pagination

### Pagination Format
```
GET /api/events?pagination[page]=1&pagination[pageSize]=10
```

### Response Format
```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 47
    }
  }
}
```

### Implementation
```typescript
// src/components/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
```

## Filtering

### Filter Syntax
```
GET /api/events?filters[status][$eq]=published
GET /api/events?filters[date][$gte]=2024-01-01
GET /api/events?filters[location][$contains]=New York
```

### Supported Operators
- `$eq` - Equal to
- `$ne` - Not equal to
- `$lt` - Less than
- `$lte` - Less than or equal to
- `$gt` - Greater than
- `$gte` - Greater than or equal to
- `$in` - In array
- `$nin` - Not in array
- `$contains` - String contains
- `$startsWith` - String starts with
- `$endsWith` - String ends with

### Example Filters
```bash
# Get published events
curl "http://13.53.89.25:1337/api/events?filters[status][$eq]=published"

# Get events in 2024
curl "http://13.53.89.25:1337/api/events?filters[date][$gte]=2024-01-01&filters[date][$lt]=2025-01-01"

# Get news from specific author
curl "http://13.53.89.25:1337/api/news?filters[author][name][$eq]=John%20Doe"
```

## Sorting

### Sort Syntax
```
GET /api/events?sort=date:desc
GET /api/events?sort=title:asc
GET /api/events?sort=createdAt:desc,title:asc
```

### Examples
```bash
# Sort by date (newest first)
curl "http://13.53.89.25:1337/api/events?sort=date:desc"

# Sort by title (A-Z)
curl "http://13.53.89.25:1337/api/events?sort=title:asc"

# Multiple sorts
curl "http://13.53.89.25:1337/api/events?sort=status:asc,date:desc"
```

## Webhooks (Future)

```javascript
// When implemented, webhooks will notify on:
// - Content published
// - Content updated
// - Content deleted
// - User actions

// POST /webhooks/content-update
// {
//   "event": "entry.publish",
//   "model": "event",
//   "entry": { /* event data */ }
// }
```

## Testing API Endpoints

### Using cURL
```bash
# Get all events
curl -X GET "http://13.53.89.25:1337/api/events?populate=*"

# Get single event
curl -X GET "http://13.53.89.25:1337/api/events/1"

# Filter events
curl -X GET "http://13.53.89.25:1337/api/events?filters[location][$contains]=New"
```

### Using Postman
1. Create new request
2. Set method to GET
3. Enter URL: `http://13.53.89.25:1337/api/events?populate=*`
4. Click Send
5. View response

### Using REST Client Extension (VS Code)
Create `api.rest`:
```http
### Get all events
GET http://13.53.89.25:1337/api/events?populate=*

### Get single event
GET http://13.53.89.25:1337/api/events/1

### Get news
GET http://13.53.89.25:1337/api/news?populate=*
```

## Performance Tips

### Populate Only Needed Relations
```bash
# Instead of populate=*
GET /api/events?populate=image,category

# More efficient - smaller response
```

### Use Pagination
```bash
# Instead of fetching all records
GET /api/events

# Use pagination
GET /api/events?pagination[pageSize]=10
```

### Cache Responses
```typescript
// Next.js ISR
const response = await fetch(url, {
  next: { revalidate: 3600 } // Revalidate every hour
});
```

### Implement Search
```bash
GET /api/events?filters[title][$contains]=conference&sort=date:desc
```

---

**Last Updated**: January 2025
**Strapi Version**: Latest
**API Format**: RESTful JSON
