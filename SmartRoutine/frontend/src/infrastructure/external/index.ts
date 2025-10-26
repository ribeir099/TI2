/**
* Barrel export de todos os serviços externos
* 
* Facilita imports:
* import { 
*   pdfGenerator, 
*   imageService,
*   iaService 
* } from '@/infrastructure/external';
*/

// PDF Generation
export * from './PDFGenerator';

// Image Processing
export * from './ImageService';

// AI Integration
export * from './IAService';

// Email Service
export * from './EmailService';

// Notifications
export * from './NotificationService';

// Analytics
export * from './AnalyticsService';

// Export/Import
export * from './ExportService';

// Geolocation
export * from './GeolocationService';

// Clipboard
export * from './ClipboardService';

// Web Share
export * from './WebShareService';

// Re-export singleton instances
export { pdfGenerator } from './PDFGenerator';
export { imageService } from './ImageService';
export { iaService } from './IAService';
export { emailService } from './EmailService';
export { notificationService } from './NotificationService';
export { analyticsService } from './AnalyticsService';
export { exportService } from './ExportService';
export { geolocationService } from './GeolocationService';
export { clipboardService } from './ClipboardService';
export { webShareService } from './WebShareService';