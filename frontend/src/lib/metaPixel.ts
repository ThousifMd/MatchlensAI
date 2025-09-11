// Meta Pixel Event Tracking Utilities

declare global {
    interface Window {
        fbq: (action: string, event: string, data?: any) => void;
    }
}

// Meta Pixel Event Types
export const META_PIXEL_EVENTS = {
    LEAD: 'Lead',
    INITIATE_CHECKOUT: 'InitiateCheckout',
    COMPLETE_REGISTRATION: 'CompleteRegistration',
    PURCHASE: 'Purchase',
    ADD_TO_CART: 'AddToCart',
    VIEW_CONTENT: 'ViewContent',
    PAGE_VIEW: 'PageView'
} as const;

// Utility function to track Meta Pixel events
export const trackMetaPixelEvent = (event: string, data?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
        try {
            window.fbq('track', event, data);
            console.log(`Meta Pixel Event Tracked: ${event}`, data);
        } catch (error) {
            console.error('Error tracking Meta Pixel event:', error);
        }
    }
};

// Specific event tracking functions
export const trackLead = (source?: string) => {
    trackMetaPixelEvent(META_PIXEL_EVENTS.LEAD, {
        content_name: source || 'CTA Button Click',
        content_category: 'lead_generation'
    });
};

export const trackInitiateCheckout = (formType?: string) => {
    trackMetaPixelEvent(META_PIXEL_EVENTS.INITIATE_CHECKOUT, {
        content_name: formType || 'Onboarding Form',
        content_category: 'form_start'
    });
};

export const trackCompleteRegistration = (formData?: any) => {
    trackMetaPixelEvent(META_PIXEL_EVENTS.COMPLETE_REGISTRATION, {
        content_name: 'Onboarding Form Submission',
        content_category: 'form_completion',
        ...formData
    });
};

export const trackPurchase = (value: number, currency: string = 'USD', packageName?: string) => {
    trackMetaPixelEvent(META_PIXEL_EVENTS.PURCHASE, {
        value: value,
        currency: currency,
        content_name: packageName || 'Matchlens Package',
        content_category: 'purchase'
    });
};

export const trackAddToCart = (packageName?: string, price?: number) => {
    trackMetaPixelEvent(META_PIXEL_EVENTS.ADD_TO_CART, {
        content_name: packageName || 'Pricing Package',
        content_category: 'pricing_selection',
        value: price,
        currency: 'USD'
    });
};

export const trackViewContent = (contentName?: string, contentType?: string) => {
    trackMetaPixelEvent(META_PIXEL_EVENTS.VIEW_CONTENT, {
        content_name: contentName || 'FAQ Section',
        content_category: contentType || 'faq_interaction'
    });
};

// CTA Button tracking with specific identifiers
export const trackCTAClick = (buttonText: string, location: string) => {
    trackLead(`${buttonText} - ${location}`);
};

// Form step tracking
export const trackFormStep = (step: number, stepName: string) => {
    trackMetaPixelEvent('CustomEvent', {
        event_name: 'FormStep',
        step_number: step,
        step_name: stepName,
        content_category: 'form_progress'
    });
};
