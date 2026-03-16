// src/data/images/products.ts
export const productImages = {
    // Smocks
    smock1: {
        main: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    },
    smock2: {
        main: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    },
    smock3: {
        main: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    },

    // Accessories
    hat1: {
        main: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1591561954555-607968c9ab9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    },
    bag1: {
        main: 'https://images.unsplash.com/photo-1591561954555-607968c9ab9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1591561954555-607968c9ab9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1591561954555-607968c9ab9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    },
    jewelry1: {
        main: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    },

    // Fabrics
    fabric1: {
        main: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1607344645866-009c320b63e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    },
};

// Helper to get random product images
export const getRandomProductImages = (count: number = 1) => {
    const images = Object.values(productImages);
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};