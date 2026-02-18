export function formatPrice(price: number): string {
    if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
}

export function formatArea(sqft: number): string {
    return `${sqft.toLocaleString("en-IN")} sq.ft`;
}

export function getWhatsAppLink(phone: string, propertyTitle: string): string {
    const message = encodeURIComponent(
        `Hi, I'm interested in the property: ${propertyTitle}. Can you share more details?`
    );
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanPhone}?text=${message}`;
}

export function getPhoneLink(phone: string): string {
    return `tel:${phone}`;
}

export function timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

export function generateSEOTitle(property: {
    bedrooms: number;
    type: string;
    location: string;
    price: number;
}): string {
    const typeLabel = property.type === "PLOT" ? "Plot" : `${property.bedrooms}BHK House`;
    return `${typeLabel} for Sale in ${property.location} | ${formatPrice(property.price)}`;
}
