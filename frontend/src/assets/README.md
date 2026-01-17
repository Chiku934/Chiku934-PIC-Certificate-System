# Frontend Assets

This folder contains static assets for the Angular application. All files in this folder are served directly by the Angular development server and will be included in the production build.

## Folder Structure

```
assets/
├── images/          # General images (photos, backgrounds, etc.)
├── icons/           # Icon files (PNG, SVG, etc.)
├── logos/           # Company logos and branding
└── README.md        # This file
```

## Usage in Components

### HTML Templates
```html
<!-- Reference assets in templates -->
<img src="/assets/logos/company-logo.png" alt="Company Logo">
<img src="/assets/icons/setup-icon.png" alt="Setup Icon">
```

### TypeScript/SCSS
```typescript
// In component TypeScript
iconUrl = '/assets/icons/my-icon.png';
```

```scss
// In component SCSS
.my-element {
  background-image: url('/assets/images/background.jpg');
}
```

## File Naming Convention

- Use kebab-case for file names: `company-logo.png`, `user-avatar.jpg`
- Include descriptive names: `setup-icon.png`, `certification-badge.svg`
- Use consistent file extensions: `.png`, `.jpg`, `.svg`, `.ico`

## Image Optimization

- Use appropriate formats:
  - **PNG**: For icons, logos, images with transparency
  - **JPG**: For photos and complex images
  - **SVG**: For scalable icons and logos
- Optimize file sizes for web delivery
- Consider responsive images for different screen sizes

## Application-Specific Assets

### Dashboard Icons
- `setup-icon.png` - Setup module icon
- `certification-icon.png` - Certification module icon
- `audit-icon.png` - Audit module icon

### Company Assets
- `company-logo.png` - Main company logo
- `letterhead-header.png` - Letter head header image
- `letterhead-footer.png` - Letter head footer image

## Angular CLI Configuration

The assets folder is automatically configured in `angular.json` to be copied to the dist folder during build. No additional configuration is needed.

```json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              "src/assets"
            ]
          }
        }
      }
    }
  }
}
```

## Development Server

During development (`ng serve`), assets are served from `http://localhost:4200/assets/`.

## Production Build

During production build (`ng build`), assets are copied to the `dist/` folder and served from the same relative paths.
