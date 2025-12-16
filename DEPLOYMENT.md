# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

## Build Process

### Development Build

```bash
npm install
npm run dev
```

Starts development server at `http://localhost:5173`

### Production Build

```bash
npm install
npm run build
```

Creates optimized production build in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally.

## Deployment Options

### Static Hosting (Recommended)

The application is a static React app and can be deployed to any static hosting service:

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### GitHub Pages
1. Update `vite.config.js` with base path
2. Build the project
3. Deploy `dist/` folder to GitHub Pages

#### AWS S3 + CloudFront
1. Build the project: `npm run build`
2. Upload `dist/` contents to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t rail-freight-app .
docker run -p 80:80 rail-freight-app
```

## Environment Configuration

### Development
No environment variables required. Uses LocalStorage for data persistence.

### Production
For production with backend API, create `.env.production`:
```
VITE_API_URL=https://api.example.com
VITE_AUTH_ENABLED=true
```

Update `vite.config.js` to use environment variables.

## Build Optimization

The production build includes:
- Code minification
- Tree shaking
- Asset optimization
- CSS extraction
- Source maps (optional)

### Build Size
- JavaScript: ~350KB (gzipped: ~105KB)
- CSS: ~20KB (gzipped: ~7KB)

## Testing Before Deployment

1. **Run Tests**:
   ```bash
   npm test
   ```

2. **Check Build**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Lint Check**:
   ```bash
   npm run lint
   ```

## Post-Deployment Checklist

- [ ] Verify application loads correctly
- [ ] Test route finding functionality
- [ ] Test submission workflow
- [ ] Test freight placement visualization
- [ ] Verify map loads with satellite view
- [ ] Check LocalStorage persistence
- [ ] Test on multiple browsers
- [ ] Verify responsive design
- [ ] Check console for errors

## Monitoring

### Recommended Tools
- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Performance**: Lighthouse, WebPageTest

### Key Metrics to Monitor
- Page load time
- JavaScript errors
- API response times (when backend added)
- User interactions
- Submission completion rates

## Backup Strategy

Currently uses LocalStorage (client-side). For production:
- Implement backend API
- Regular database backups
- Export functionality for submissions

## Security Considerations

### Current Implementation
- Client-side only
- No authentication
- LocalStorage data (not secure for sensitive data)

### Production Recommendations
- Implement authentication (JWT, OAuth)
- Use HTTPS only
- Backend API with proper validation
- Role-based access control
- Input sanitization
- CORS configuration
- Rate limiting
- Secure file upload handling

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear `node_modules` and reinstall
- Check for syntax errors

### Map Not Loading
- Verify Leaflet CSS is included
- Check browser console for errors
- Ensure internet connection for tile layers

### Tests Failing
- Run `npm test -- --run` to see detailed errors
- Check test setup files
- Verify all dependencies installed

## Support

For deployment issues, check:
- GitHub Issues
- Documentation
- Test suite for examples

