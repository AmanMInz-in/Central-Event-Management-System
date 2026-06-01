# Centralized College Event Management System

Full stack MERN application with:
- React, Tailwind, React Router frontend
- Node/Express, MongoDB backend
- JWT authentication
- Role-based access (admin, club associate, student)

## Project Structure
- `client/` - frontend
- `server/` - backend

## Running locally
### Backend
1. `cd server`
2. `npm install`
3. set `.env` values from `.env.example`
4. `npm run dev`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `GET /api/gallery`

## Notes
- Use MongoDB Atlas for `MONGO_URI`.
- Deploy front-end to Netlify/Vercel and back-end to Render/Railway.

https://central-event-management-system.vercel.app/
